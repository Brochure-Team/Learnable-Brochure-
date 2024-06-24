import axios from "axios";
import { getZoomRequestDetails } from "../../configs";
import meetingService from "./meeting.service";
import { meetingAttendanceService } from ".";
import { getMeetingTrack, getNameAndTrack } from "../utils/meeting.util";


export default async (meetingId: string) => {
    const { headers, baseUrl } = await getZoomRequestDetails();
  
    const meetingReportUrl = `${baseUrl}/report/meetings/${meetingId}`
    const { data } = await axios.get(meetingReportUrl, { headers });
    const meetingReport = data
    
    if (!meetingReport.topic.toLowerCase().includes('l23')) {
      console.log(`${meetingReport.topic} is not a Learnable Meeting.`);
      return
    }

    let isExistingMeeting = await meetingService.findOne({ id: meetingReport.id })
    const tracks = getMeetingTrack(meetingReport.topic)
    
    if (isExistingMeeting) {
      console.log('already exists');
    } else {
      isExistingMeeting = await meetingService.create({
        tracks,
        topic: meetingReport.topic,
        ...meetingReport
      })
      console.log('created', isExistingMeeting);
    }
    
    // Fetches meeting participants
    const meetingParticipantsUrl = `${baseUrl}/report/meetings/${meetingId}/participants?page_size=300`
    const { data: { participants, page_count, next_page_token } } = await axios.get(`${meetingParticipantsUrl}`, { headers });
    let meetingParticipants = participants
    let nextPageToken = next_page_token

    // handles fetching all pages into one array
    for (let i = 2; page_count && page_count >= i; i++) {
      const url = `${meetingParticipantsUrl}&next_page_token=${nextPageToken}`
      const { data: { participants, next_page_token } } = await axios.get(url, { headers });
      nextPageToken = next_page_token

      meetingParticipants = [...meetingParticipants, ...participants]
    }

    // saves each participant to the database
    for (const meetingParticipant of meetingParticipants) {
      // gets participants name and track separately
      const hasExistingAttendance = await meetingAttendanceService.findOne({ meeting: isExistingMeeting._id, user_id: meetingParticipant.user_id })
      if(hasExistingAttendance) continue;

      const participantsData = getNameAndTrack(meetingParticipant.name)
      const { participantsFullName, track } = participantsData

      // checks if participant should be in the meeting
      if (!isExistingMeeting.tracks.includes(track)) {
        console.log('meeting tracks:', tracks);
        console.log(`There is no attendance for ${meetingParticipant.name} because their naming convention or track: ${track} does not match for this meeting`);
        continue;
      }

      // creates attendance for the participant
      delete meetingParticipant.name

      meetingParticipant.score = (meetingParticipant.duration / (meetingReport.duration * 60)) * 100

      const newAttendance = await meetingAttendanceService.create({
        meeting: isExistingMeeting._id,
        track,
        name: participantsFullName,
        ...meetingParticipant
      })
      console.log("Participant Before:", meetingParticipant.name, track, meetingParticipant);
      console.log("Attendance Created for:", newAttendance.name, track, newAttendance);
    }
    return 'ZOOM MEETINGS AND ATTENDANCE UPDATED SUCCESSFULLY FOR:' +  meetingReport
  }
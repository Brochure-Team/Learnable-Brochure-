import axios from "axios";
import { getZoomRequestDetails } from "../../configs";
import meetingService from "./meeting.service";
import { meetingAttendanceService } from ".";
import { getMeetingTrack, getNameAndTrack } from "../utils/meeting.util";
import meetings from "../../data/meetings";

async function fetchMeetingDetails() {
  const { id, headers, baseUrl } = await getZoomRequestDetails();
  // console.log(headers);
  
  // Fetch all past meetings
  // const meeting_url = `${baseUrl}/users/${id}/meetings?page_size=300`
  // const { data: { meetings, next_page_token } } = await axios.get(meeting_url, { headers });

  // // Handles fetching all pages of the meetings into one array
  // let _meetings = meetings
  // let nextPageToken = next_page_token

  // for (let i = 0; nextPageToken.length > 0; i++) {
  //   const url = `${meeting_url}&next_page_token=${nextPageToken}`
  //   const { data: { meetings, next_page_token } } = await axios.get(url, { headers });

  //   _meetings = [..._meetings, ...meetings]
  //   nextPageToken = next_page_token
  // }

  // filters to get unexpired meetings from zoom
  // const filteredMeetings = meetings.filter((meeting: any) => meeting.topic.toLowerCase().includes('l23'))

  // checks and stores every new meeting on the database
  for (const meeting of meetings) {
    const meetingReportUrl = `${baseUrl}/report/meetings/${meeting.id}`
    const { data } = await axios.get(meetingReportUrl, { headers });
    const { id, topic } = data
    const meetingReport = data

    let isExistingMeeting = await meetingService.findOne({ id })
    if (isExistingMeeting) {
      console.log('already exists');
      continue;
    }

    // gets meeting tracks
    delete meetingReport.topic
    
    // const tracks = getMeetingTrack(topic)
    isExistingMeeting = await meetingService.create({
      tracks: meeting.tracks,
      topic: meeting.topic,
      ...meetingReport
    })

    // Fetches meeting participants
    const meetingParticipantsUrl = `${baseUrl}/report/meetings/${meeting.id}/participants?page_size=300`
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
      const hasExistingAttendance = await meetingAttendanceService.findOne({ meeting: isExistingMeeting._id, user_id: meetingParticipant.user_id })
      
      if(hasExistingAttendance) continue;

      // gets participants name and track separately
      const participantsData = getNameAndTrack(meetingParticipant.name)
      const { participantsFullName, track } = participantsData

      // checks if participant should be in the meeting
      if (!isExistingMeeting.tracks.includes(track)) {
        console.log('meeting tracks:', meeting.tracks);
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
  }
  console.log("ZOOM MEETINGS AND ATTENDANCE UPDATED SUCCESSFULLY");
}

setInterval(fetchMeetingDetails, parseFloat(<string>process.env.FETCH_TIME))
const tracks = [ 'frontend', 'backend', 'web3', 'product design' ]
const devs = [ 'frontend', 'backend', 'web3' ]

export function getMeetingTrack(topic: string) {
    if(topic.toLowerCase().includes('l23d')) return devs
    if(topic.toLowerCase().includes('l23e')) return tracks
    if(topic.toLowerCase().includes('l23f')) return [ 'frontend' ]
    if(topic.toLowerCase().includes('l23b')) return [ 'backend' ]
    if(topic.toLowerCase().includes('l23p')) return [ 'product design' ]
    return []
}

export function getNameAndTrack(participantsNameOnMeeting: string) {
    // Gets the participants fullname as it is on the meeting with the first letter of their track enclosed in brackets and splits everything into an array
    const lettersInName = participantsNameOnMeeting.split("");
  
    // Loops through the array to find their track in brackets irrespective of the spacing
    let indexOfLetter = 0;
    let i = 0;
    for (const letter of lettersInName) {
      if (letter === "(") {
        indexOfLetter = i;
      }
      i++;
    }
  
    // Brings their tracks with the brackets out of their fullname as it is on the meeting
    const lettersInParticipantsTrack = lettersInName.splice(indexOfLetter);
  
    // Brings their name with the brackets out
    const participantsFullName = lettersInName.join("").trim();
  
    // Handles the spaces in the track to return it in the correct format for checks
    let participantsTrackInBracket = "";
    for (const letterInParticipantsTrack of lettersInParticipantsTrack) {
      if (letterInParticipantsTrack !== " ")
        participantsTrackInBracket = `${participantsTrackInBracket}${letterInParticipantsTrack}`;
    }
  
    // Assigns their tracks from the content of the bracket
    let track = "";
    if (participantsTrackInBracket.toLowerCase() === "(w)") track = "web3";
    if (participantsTrackInBracket.toLowerCase() === "(b)") track = "backend";
    if (participantsTrackInBracket.toLowerCase() === "(f)") track = "frontend";
    if (participantsTrackInBracket.toLowerCase() === "(p)") track = "product design";
  
    // Returns their name and track
    return { participantsFullName, track };
  };
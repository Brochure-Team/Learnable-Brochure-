const tasks = [1, 2, 3, 5, 5];
const appraisals = [1, 2, 3, 5, 5];
const bonus = 2;
const strikes = 2

const taskWeight = 10 * tasks.length
const bonusWeight = 5
const appraisalWeight = 5 * appraisals.length
const strikeWeight = 10 
const totalWeight = taskWeight + bonusWeight + appraisalWeight

const points = (tasks.reduce((acc, task) => acc + task, 0) + bonus + appraisals.reduce((acc, appraisal) => acc + appraisal, 0)) - strikes
const powerRanking = (points / totalWeight) * 100
console.log(`${totalWeight} ${points} ${powerRanking}%`);


// Getting all tasks
const { somtosTasks, michaelsTasks } = {
    somtosTasks: [
        {
            score: 10
        }, 
        {
            score: 10
        },
        {
            score: 9
        },
        {
            score: 6
        },
        {
            score: 10
        },
        {
            score: 10
        },
        {
            score: 9.5
        },
        {
            score: 9
        },
        {
            score: 9.9
        },
        {
            score: 9
        }, 
        {
            score: 6
        }, 
        {
            score: 10
        }, 
        {
            score: 9
        },
    ],
    michaelsTasks: [
        {
            score: 9
        }, 
        {
            score: 7
        },
        {
            score: 8.8
        },
        {
            score: 9.5
        },
        {
            score: 10
        },
        {
            score: 10
        },
        {
            score: 9.5
        },
        {
            score: 10
        },
        {
            score: 7.5
        },
        {
            score: 9
        }, 
        {
            score: 8
        }, 
        {
            score: 8
        }, 
        {
            score: 10
        },
    ]
}

/* 
- attendance is 100/5 (20)
this is calculated by getting the total time of the meeting and dividing by how long you stayed then multiplying by 100
example: meeting duration = 3hrs, intern stayed for 1hr.
attendance = (1 / 3) * 100 = 33% 
- said percentage has a score and it all must sum up to 20 marks (dividing by 5)

- bonuses are weighted at 5 marks.
- strikes are weighted at negative 10 marks per strike
- tasks are weighted at 10 marks per task
- appraisals are weighted at 5 marks per appraisal
- points are a sumation of all tasks, bonus points, attendance and appraisals minus strike
- power ranking is the ratio of an interns total points to the total weighted points multiplied by 100.

*/
// Getting rank details
const { somtosRankDetails, michaelsRankDetails } = {
    somtosRankDetails: {
        rank: 4,
        previousRank: 4,
        pointsMoved: 0
     },
     michaelsRankDetails: {
         rank: 3,
         previousRank: 3,
         pointsMoved: 0
     } 
}

// The leaderboard itself
const leaderboard = [{
    pointsMoved: somtosRankDetails.rank - somtosRankDetails.previousRank,
    previousRank: somtosRankDetails.previousRank,
    rank: somtosRankDetails.rank,
    firstName: 'Somtochukwu',
    lastName: 'Uzuakpunwa',
    bonus: 0,
    strikes: 0,
    attendance: 88,
    appraisals: [4, 4.3, 4.7],
    tasks: somtosTasks,
    points: 2965,
    powerRanking: 87.20
},
{
    pointsMoved: michaelsRankDetails.rank -  michaelsRankDetails.previousRank,
    previousRank:  michaelsRankDetails.previousRank,
    rank:  michaelsRankDetails.rank,
    firstName: 'Michael',
    lastName: 'Orji',
    article: 0,
    bonus: 1,
    strikes: 0,
    attendance: 93,
    appraisals: [5, 4.4, 3.8],
    tasks: michaelsTasks,
    points: 2975,
    powerRanking: 87.50
}]

/* Leaderboard Updating Logic */
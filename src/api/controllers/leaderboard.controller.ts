import { Request, Response } from "express"
import { getTotal, sendResponse } from "../utils"
import { IAppraisal, IAttendance, IBonus, ILeaderBoard, ITask, ITaskSubmission, IUser, InternInterface } from "../interfaces"
import { bonusService, strikeService, attendanceService, appraisalService, internService, leaderBoardService, taskService, taskSubmissionService, groupService } from "../services"

class LeaderBoardController {
    async createLeaderBoardEntry() {
        const interns = (await internService.findAll({})).data as InternInterface[]
        const leaderboardEntries = (await leaderBoardService.findAll({})).data as ILeaderBoard[]

        if (interns.length !== leaderboardEntries.length) {
            for (const intern of interns) {
                const entriesWithAnIntern = leaderboardEntries.filter(entry => (entry.intern as IUser)._id.toString() === intern._id.toString())

                if (entriesWithAnIntern.length === 0) {
                    //create new leaderboard entry with intern id
                    await leaderBoardService.create({
                        intern: intern._id,
                        track: intern.track
                    })
                    // await appraisalService.create({
                    //     intern: intern._id,
                    //     score: 0
                    // })
                    // await bonusService.create({
                    //     intern: intern._id
                    // })
                    // await strikeService.create({
                    //     intern: intern._id
                    // })
                    // await attendanceService.create({
                    //     intern: intern._id,
                    //     score: 0,
                    //     percentage: 0
                    // })
                }
            }
        }
    }

    updateLeaderBoard = async (req: Request, res: Response) => {
        await this.createLeaderBoardEntry()

        const data: any = {}
        let allEntries: any[]= []
        let entriesByTrack: any[] = [];

        const { data: taskSubmissions } = await taskSubmissionService.findAll({ deleted: false })
        const unMarkedtasks = (taskSubmissions as ITaskSubmission[]).filter((submission: ITaskSubmission) => !submission.isGraded)

        if (unMarkedtasks.length > 0) {
            // 658212682cf5aa6dacade572 ...change back later
            return sendResponse(res, 403, false, "Leaderboard cannot be updated until all tasks are graded.")
        }

        const leaderboardEntries = (await leaderBoardService.findAll({ deleted: false })).data as unknown as ILeaderBoard[]
        let previousRank = 0;

        for (const entry of leaderboardEntries) {
            previousRank = entry.currentRank

            // find strikes array with user id (entry.intern._id) and get the length of the strike array
            const strikes = (await strikeService.findAll({ intern: (entry.intern as IUser)._id, deleted: false })).data
            const numberOfStrikes: number = strikes.length
            const strikePoint = numberOfStrikes * 10

            // find all tasks
            const allTasks = (await taskService.findAll({ tracks: (entry.intern as InternInterface).track, deleted: false })).data as unknown as ITask[]
            // console.log('all tasks:', allTasks);

            const submissions: any[] = []

            // find the task submission by each intern for each task using the task id and intern id
            for (const task of allTasks) {
                const individualSubmissionForTask = (await taskSubmissionService.findOne({ intern: (entry.intern as IUser)._id, task: task._id }))
                let groupSubmissionForTask;

                const internsGroup = await groupService.findOne({ interns: (entry.intern as IUser)._id, task: task._id })
                if(internsGroup) groupSubmissionForTask = (await taskSubmissionService.findOne({ group: internsGroup._id }))
                
                if (!individualSubmissionForTask && allTasks) {
                    submissions.push(null)
                } else if (individualSubmissionForTask && allTasks) {
                    submissions.push(individualSubmissionForTask)
                } else if (groupSubmissionForTask && allTasks) {
                    submissions.push(groupSubmissionForTask)
                }
            }

            // map just the submission scores of an intern into a new array and sum them up for point calculation
            const taskScores: number[] = submissions.map(submission => submission && submission.grade)
            const totalTaskScore = getTotal(taskScores)
            // console.log('submissions, task scores and total task scores:', submissions,taskScores, totalTaskScore);

            // find all appraisals for an intern
            const appraisals = (await appraisalService.findAll({ intern: (entry.intern as IUser)._id, deleted: false })).data as unknown as IAppraisal[]

            // map just the appraisal scores of an intern into a new array and sum them up for point calculation
            const appraisalScores = appraisals.map(appraisal => appraisal.score)
            const totalAppraisalScore = getTotal(appraisalScores)

            // find all bonuses for an intern and get the total for point calculation
            const bonuses = (await bonusService.findAll({ intern: (entry.intern as IUser)._id, deleted: false })).data as unknown as IBonus[]
            const numberOfBonuses: number = bonuses.length

            // find all attendance for an intern and get the scores for point calculation
            const attendances = (await attendanceService.findAll({ intern: (entry.intern as IUser)._id, deleted: false })).data as unknown as IAttendance[]
            const attendanceScores: number[] = attendances.map(attendance => attendance.score)
            const totalAttendancePoints = attendanceScores.length > 0 ? getTotal(attendanceScores) / attendances.length : 0

            const points = (numberOfBonuses + (totalAttendancePoints / 5) + totalAppraisalScore + totalTaskScore) - strikePoint
            const powerRanking = (points / 170) * 100

            // await leaderBoardService.updateOne({ intern: (entry.intern as IUser)._id }, {
            //     bonus: numberOfBonuses,
            //     strikes: numberOfStrikes,
            //     attendance: totalAttendancePoints,
            //     appraisals: appraisalScores,
            //     tasks: submissions,
            //     points,
            //     powerRanking,
            //     previousRank
            // })

            const entryToUpdate = { 
                intern: (entry.intern as IUser)._id,
                bonus: numberOfBonuses,
                strikes: numberOfStrikes,
                attendance: totalAttendancePoints,
                appraisals: appraisalScores,
                tasks: submissions,
                points,
                powerRanking,
                previousRank,
                track: (entry.intern as InternInterface).track
            }
            allEntries.push(entryToUpdate)
        }

        allEntries = allEntries.sort((a, b) => b.points - a.points)

        for (let i = 0; i < allEntries.length; i++) {
            const rankEntry = allEntries[i];
            const pointsMoved = rankEntry.previousRank - (i + 1)

            allEntries[i].currentRank = i + 1,
            allEntries[i].pointsMoved = pointsMoved
        }

        data['general'] = allEntries

        const tracks = ['frontend', 'backend', 'web3', 'product design']

        for (const track of tracks) {
            // const entries = (await leaderBoardService.findAll({ deleted: false, track })).entries
            // const sortedRankEntries = entries.sort((a, b) => b.points - a.points)

            // for (let i = 0; i < sortedRankEntries.length; i++) {
            //     const rankEntry = sortedRankEntries[i];
            //     const pointsMoved = rankEntry.previousRank - (i + 1)

            //     await leaderBoardService.updateOne({ intern: (rankEntry.intern as IUser)._id }, {
            //         currentRank: i + 1,
            //         pointsMoved
            //     })
            // }

            data[track] = allEntries.filter((entry) => entry.track === track).sort((a, b) => b.points - a.points)

            for (let i = 0; i < entriesByTrack.length; i++) {
                const rankEntry = data[track][i];
                const pointsMoved = rankEntry.previousRank - (i + 1)

                data[track][i].currentRank = i + 1,
                data[track][i].pointsMoved = pointsMoved
            }
        }

        return sendResponse(res, 200, true, 'Leaderboard successfully updated.', data)
    }

    async getLeaderBoardEntries(req: Request, res: Response) {
        const { data: entries } = await leaderBoardService.findAll(req.query)

        if (!entries) return sendResponse(res, 401, false, 'There was an error fetching leaderboard entries.')

        if (entries.length === 0) return sendResponse(res, 404, false, 'There are no leaderboard entries matching your search.')

        return sendResponse(res, 200, true, 'Leaderboard entries fecthed successfully!', entries)
    }
}

export default new LeaderBoardController();
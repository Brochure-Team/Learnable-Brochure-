import { Request, Response } from "express";
import { announcementService } from "../services";
import { sendMail, sendResponse } from "../utils";
import { IGenericObject } from "../interfaces";
import { User } from "../models";

// from @Victor Erike

//     /api/v1/announcements/    to create
//     /api/v1/announcements/:id to get one
//     /api/v1/announcements/:id to edit one
//     /api/v1/announcements/:id to delete one
//     /api/v1/announcements/ to view all announcements

class AnnouncementController {
    async createAnnouncement(req: Request, res: Response) {

        const { content, subject } = req.body
        const words = content.split(' ');

        const allWordsWithTags: string[] = [];
        words.forEach((word: string) => {
            if (word.startsWith('@') && word.length > 1) {
                allWordsWithTags.push(word)
            }
        })

        const allMentionedUsers: Object[] = [];
        allWordsWithTags.forEach(async (wordWithTag: string) => {

            const wordToSearchFor = wordWithTag.substring(1, wordWithTag.length);

            if (wordToSearchFor === 'front end' || wordToSearchFor === 'frontend') {
                /*return all users with track front end. example: */
                const users = await User.find({ track: 'front end' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'back end' || wordToSearchFor === 'backend') {
                /*return all users with track back end*/
                const users = await User.find({ track: 'back end' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'product design' || wordToSearchFor === 'productdesign') {
                /*return all users with track product design*/
                const users = await User.find({ track: 'product design' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'web 3' || wordToSearchFor === 'web3') {
                /*return all users with track web 3*/
                const users = await User.find({ track: 'web 3' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'everyone') {
                /*return all users with track web 3*/
                const users = await User.find();

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }
        })

        req.body.mentions = allMentionedUsers;


        const newAnnouncement = await announcementService.create(req.body)
        const isSent = await sendMail(req.body.mentions, subject, content)

        console.log('mail details: ', isSent);

        return sendResponse(res, 201, true, 'Announcement successfully created', { newAnnouncement })
    }

    async getAnnouncement(req: Request, res: Response) {
        const { id: _id } = req.params

        const existingAnnouncement = await announcementService.findOne({ _id })

        if (!existingAnnouncement) return sendResponse(res, 404, false, 'Announcement does not exist')

        return sendResponse(res, 201, true, 'Announcement fetched successfully', { existingAnnouncement })
    }

    async updateAnnouncement(req: Request, res: Response) {
        const { id: _id } = req.params
        const { content, subject } = req.body
        const existingAnnouncement = await announcementService.findOne({ _id });

        if (!existingAnnouncement) return sendResponse(res, 404, false, 'Announcement does not exist');
        
        const words = content.split(' ');

        const allWordsWithTags: string[] = [];
        words.forEach((word: string) => {
            if (word.startsWith('@') && word.length > 1) {
                allWordsWithTags.push(word)
            }
        })

        const allMentionedUsers: Object[] = [];
        allWordsWithTags.forEach(async (wordWithTag: string) => {

            const wordToSearchFor = wordWithTag.substring(1, wordWithTag.length);

            if (wordToSearchFor === 'front end' || wordToSearchFor === 'frontend') {
                /*return all users with track front end. example: */
                const users = await User.find({ track: 'front end' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'back end' || wordToSearchFor === 'backend') {
                /*return all users with track back end*/
                const users = await User.find({ track: 'back end' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'product design' || wordToSearchFor === 'productdesign') {
                /*return all users with track product design*/
                const users = await User.find({ track: 'product design' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'web 3' || wordToSearchFor === 'web3') {
                /*return all users with track web 3*/
                const users = await User.find({ track: 'web 3' });

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }

            if (wordToSearchFor === 'everyone') {
                /*return all users with track web 3*/
                const users = await User.find();

                /* add each returned user to the array of mentions provided they havent been added already */
                if (users) users.forEach(user => {
                    if (!allMentionedUsers.includes(user)) allMentionedUsers.push(user);
                })
            }
        })

        req.body.mentions = allMentionedUsers;

        const updatedAnnouncement = await announcementService.updateOne({ _id }, req.body);

        const isSent = await sendMail(req.body.mentions, subject, content)

        console.log('update mail details: ', isSent);

        return sendResponse(res, 200, true, 'Announcement successfully updated', { updatedAnnouncement });
    }

    async deleteAnnouncement(req: Request, res: Response) {
        const { id: _id } = req.params

        const existingAnnouncement = await announcementService.findOne({ _id: req.params.id });

        if (!existingAnnouncement) return sendResponse(res, 404, false, 'Announcement does not exist');

        const deletedAnnouncement = await announcementService.deleteOne({ _id });

        return sendResponse(res, 200, true, 'Announcement successfully deleted', { deletedAnnouncement });
    }

    async getAllAnnouncements(req: Request, res: Response) {
        const query: IGenericObject = {}

        if (req.query.id) query._id = req.query.id
        if (req.query._id) query._id = req.query._id
        if (req.query.mentions) query.mentions = req.query.mentions


        const { data: announcements, currentPage, totalPages } = await announcementService.findAll(query)

        if (!announcements) return sendResponse(res, 404, false, 'There are no announcements matching your search')

        const existingAnnouncements = announcements

        return sendResponse(res, 200, true, 'Announcements successfully fetched', existingAnnouncements, { currentPage, totalPages })
    }

}

export default new AnnouncementController();
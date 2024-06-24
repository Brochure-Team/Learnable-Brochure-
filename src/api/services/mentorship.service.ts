import { IUser, InternInterface } from "../interfaces"
import { ForbiddenException, NotFoundException } from "./error.service"
import { internService, mentorService } from "./user.service"

class MentorShipService {
    async givePermission(mentor_id: string, permission: string) {
        const isExistingMentor = await mentorService.findOne({ _id: mentor_id }, '-password')
        if(!isExistingMentor) throw new NotFoundException('Mentor not found.')

        if(isExistingMentor.permissions.includes(permission)) throw new ForbiddenException('This mentor already has this permission!')
  
        isExistingMentor.permissions.push(permission)
        const updatedMentor = await isExistingMentor.save()

        return updatedMentor
    }

    async takePermission(mentor_id: string, permission: string) {
        const isExistingMentor = await mentorService.findOne({ _id: mentor_id }, '-password')
        if(!isExistingMentor) throw new NotFoundException('Mentor not found.')

        if(!isExistingMentor.permissions.includes(permission)) throw new ForbiddenException('This mentor does not have this permission!')
  
        const permissions = isExistingMentor.permissions

        for (let i = 0; i < permissions.length; i++) {
            const permissionToRemove = permissions[i];
            
            if(permissionToRemove === permission) isExistingMentor.permissions.splice(i, 1)
        }

        const updatedMentor = await isExistingMentor.save()

        return updatedMentor
    }

    async assignMentor(mentor_id: string, interns: string[]) {
        const isExistingMentor = await mentorService.findOne({ _id: mentor_id }, '-password')
        if(!isExistingMentor) throw new NotFoundException('Mentor not found.')

        const addedInterns: InternInterface[] = []
        for(const intern of interns) {
            const isExistingIntern: InternInterface | null = await internService.findOne({ _id: intern }, '-password')
            console.log(123, intern, isExistingIntern);
            
            if(!isExistingIntern) throw new NotFoundException(`Intern not found`)

            if(isExistingIntern.track !== isExistingMentor.track) throw new ForbiddenException(`This mentor is not in this intern's track.`)
        
            if(isExistingIntern.mentor) throw new ForbiddenException(`${isExistingIntern.fullName} already has a mentor`)

            isExistingIntern.mentor = isExistingMentor._id
            const addedIntern = await isExistingIntern.save()
            addedInterns.push(addedIntern)
        }

        const updatedMentor = await isExistingMentor.save()

        const data = {
            mentor: updatedMentor,
            interns: addedInterns,
        }

        return data
    }

    async changeMentor(mentor_id: string, intern_id: string) {
        const isExistingMentor = await mentorService.findOne({ _id: mentor_id }, '-password')
        if(!isExistingMentor) throw new NotFoundException('Mentor not found.')

        const isExistingIntern = await internService.findOne({ _id: intern_id }, '-password')
        if(!isExistingIntern) throw new NotFoundException(`Intern not found`)

        if((isExistingIntern.mentor as IUser)?._id.toString() === mentor_id) throw new ForbiddenException(`This mentor is already assigned to this intern.`)
        isExistingIntern.mentor = isExistingMentor._id

        if(isExistingIntern.track !== isExistingMentor.track) throw new ForbiddenException(`This mentor is not in this intern's track.`)
        
        const addedIntern = await isExistingIntern.save()

        return addedIntern
    }
}

export default new MentorShipService()
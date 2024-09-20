import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "./SkillsSection";


const ProfilePage = () => {
    const {username} = useParams();
    const queryClient = useQueryClient();
    const {data: authUser, isLoading} = useQuery({
        queryKey: ['authUser'],
    })
    const {data: userProfile, isLoading: isUserProfileLoading} = useQuery({
        queryKey: ['profile', username],
        queryFn: () => axiosInstance.get(`/users/${username}`),
        
    })
    const {mutate:updateProfile} = useMutation({
        mutationFn: (data) => axiosInstance.put('/users/profile', data),
        onSuccess: () => {
            queryClient.invalidateQueries(["authUser"]);
        }

    })
    if(isLoading || isUserProfileLoading) return null;
    const isOwnProfile =authUser.username === userProfile.data.username;
    const userData=isOwnProfile ? authUser : userProfile.data;
    const handleSave = (data) => {
        updateProfile(data)
        
    }
  return (
    <div className='max-w-4xl mx-auto p-4'>
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
		</div>
  )
}

export default ProfilePage
import {Slot} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import ProfilePageHeader from '@/components/profilePagesHeader';


const ProfileLayout = () =>{


    return(
        <SafeAreaView className='bg-primary flex-1'>
         <ProfilePageHeader />
          <Slot />
        </SafeAreaView >
    )
}

export default ProfileLayout
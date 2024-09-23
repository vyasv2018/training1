
import { View, Text } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';

const Index = () => {
    return (
        <Redirect href='/(auth)/welcome'/>);
};

export default Index;
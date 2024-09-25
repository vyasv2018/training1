import { View, Text, Image, ScrollView } from 'react-native';
import { images, icons } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { useState } from 'react';
import { Link } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import ReactNativeModal from 'react-native-modal';

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

const [verification, setVerification]=useState({
    state: 'success',
    error: '',
    code: '',
})
    const onSignUpPress = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          await signUp.create({
            emailAddress: form.email,
            password: form.password,
          });
    
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    
          setVerification({
            ...verification,
            state:'pending'
          })
        } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
        }
      }
    
      const onPressVerify = async () => {
        if (!isLoaded) return
    
        try {
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code: verification.code,
          });
    
          if (completeSignUp.status === 'complete') {
            //TODO: Create a database user!
            await setActive({ session: completeSignUp.createdSessionId });
            setVerification({...verification, state:'success'})
          } else {
            setVerification({...verification, error: "failed", state:'failed'})
          }
        } catch (err: any) {
            setVerification({
            ...verification,
            error: err.errors[0].longMessage,
            state:"failed"
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
        })
        }
      }
    

    return (
        <ScrollView className='flex-1 bg-white'>
            <View className="flex-1 bg-white">
                <View>
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">Create Your Account</Text>
                </View>
                <View className="p-5">
                    <InputField
                        label="Name"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm({
                            ...form,
                            name: value
                        })}
                    />
                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({
                            ...form,
                            email: value
                        })}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter your password"
                        icon={icons.lock}
                        secureTextEntry={true}
                        value={form.password}
                        onChangeText={(value) => setForm({
                            ...form,
                            password: value
                        })}
                    />
                    <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6" />
                    <OAuth/>
                   
                    <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
                        <Text>Already have an account?</Text>
                        <Text className="text-primary-500"> Log In</Text>
                    </Link>
                </View>
                <ReactNativeModal isVisible={verification.state==="success"}>
                    <View className="bg-white px-7 py-9 roiunded-2xl min-h-[300px]">
                        <Image source={images.check} className= "w-[110px] h-[110px] mx-auto my-5"/>
                        </View>
                </ReactNativeModal>
            </View>
        </ScrollView>
    );
};

export default SignUp;
import React, {useState} from 'react';
import { View } from "react-native";
import { styles } from "./styles.tsx";
import TitleAuth from "@/shared/component/titleAuth";
import Input from "@/shared/component/input";
import Icon from "@/shared/component/icon";
import {eyeFilled, eyeOff, lock, mail} from "@/assets/icons";
import { Button } from "@/shared/component/buttons";
import Typography from "@/shared/component/typography";
import Wrapper from "@/shared/component/wrapper";
import CheckBox from "@/shared/component/checkbox";
import LoginService from "@/service/auth/LoginService.tsx";
import {normalize} from "@/shared/helpers";
import {Image} from "react-native";
import {logo} from "@/assets/images";
import ErrorText from "@/shared/component/ErrorText";
import AuthSessionService from "@/service/auth/AuthSessionService.tsx";
import Toasts from "@/shared/utils/Toast.tsx";

// @ts-ignore
export default function Login({ navigation }) {

  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [messageError, setMessageError] = useState('');

  const loginService = new LoginService()
  function signUp() {
    navigation.navigate('createAccount');
  }

  function forgotPassword() {
    navigation.navigate('forgotPassword');
  }
  function doLogin() {
    // @ts-ignore
    if(email === ''){
      setEmailError('Email Address is required');
    }else if(password === ''){
      setPasswordError('Password field is required');
    }else {
      setIsLoading(true);
      loginService.login(email, password).then(async function (response: any) {
        setIsLoading(false);
        setEmailError("");
        setPasswordError("");
        setMessageError("");
        if (response.status === false) {
          setPassword("");
          if (response.hasOwnProperty('email') && response.email !== false) {
            setEmailError(response.email);
          }
          if (response.hasOwnProperty('password') && response.password !== false) {
            setPasswordError(response.password);
          }
          if (response.hasOwnProperty('message') && response.message !== false) {
            setMessageError(response.message);
          }
        } else {
          const userProfile = await (new AuthSessionService().getAuthSession());
          if(userProfile.data?.phone_verified_status === false){
            Toasts("Please verify your phone number to continue!")
            navigation.navigate('enterOTP'); // user have not verify there phone lets redirect to verify
          }else{
            Toasts('Login successful, please wait..');
            setTimeout(() => {
              if(userProfile.data.apps.length === 1){
                navigation.replace("supermarket");
              } else {
                navigation.replace("storeSelector");
              }
            }, 1000)
          }
        }
      }, function (error){
        setIsLoading(false);
        if (error.hasOwnProperty('message') && error.message !== false) {
          setMessageError(error.message);
        }
      })

    }
  }
  return (
      <Wrapper>
        <View style={styles.container}>
          <View style={styles.titleImageContainer}>
            <TitleAuth title="Login Your Account" />
            <Image
                style={{
                  width: normalize(100),
                  height: normalize(60),
                  marginTop: normalize(10)
                }}
                source={logo}
            />
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Input
                  leftIcon={<Icon icon={mail} />}
                  label="Email address"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(email) => setEmail(email)}
                  placeholder="Enter Your Email Address"
              />
              {emailError !== '' ? <ErrorText>{emailError}</ErrorText> : ''}
            </View>

            <View style={styles.formControl}>
              <Input
                  leftIcon={<Icon icon={lock} />}
                  rightIcon={
                    isPasswordShown ? <Icon onPress={() => setIsPasswordShown(false)} icon={eyeOff} /> : <Icon onPress={() => setIsPasswordShown(true)} icon={eyeFilled} />
                  }
                  secureTextEntry={isPasswordShown}
                  onChangeText={(password) => setPassword(password)}
                  value={password}
                  label="Password"
                  placeholder="Enter Your Password"
              />
              {passwordError !== '' ?  <ErrorText style={{marginBottom: 10}}>{passwordError}</ErrorText> : <View/>}
            </View>

            <View style={styles.formControl}>
              <View style={styles.containerRemember}>
                <View style={styles.containerCheckbox}>
                  <CheckBox onChange={() => {}} value={true} />
                  <Typography style={styles.textRemember}>Remember me</Typography>
                </View>
                <Typography onPress={forgotPassword} style={styles.forgot}>Forgot Password</Typography>
              </View>
            </View>
          </View>
          <View style={styles.formControl}>
            {messageError !== '' ?  <ErrorText textAlign={'center'} style={{marginBottom: 10}}>{messageError}</ErrorText> : <View/>}
            <Button loading={isLoading} disabled={isLoading} onPress={doLogin}  loadingText="Sign In" title="Sign In" />
          </View>
          <View style={styles.containerLink}>
            <Typography style={styles.alreadyAccount}>{"New user ?"}</Typography>
            <Typography onPress={signUp} style={styles.link}>{"Sign Up"}</Typography>
          </View>
        </View>
      </Wrapper>
  )
}

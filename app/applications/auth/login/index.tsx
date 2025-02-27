import React, {useState} from 'react';
import { View } from "react-native";
import { styles } from "./styles.tsx";
import TitleAuth from "../../../shared/component/titleAuth";
import Input from "../../../shared/component/input";
import Icon from "../../../shared/component/icon";
import {eyeFilled, eyeOff, lock, mail} from "../../../assets/icons";
import { Button } from "../../../shared/component/buttons";
import Typography from "../../../shared/component/typography";
import Wrapper from "../../../shared/component/wrapper";
import CheckBox from "../../../shared/component/checkbox";
import LoginService from "../../../service/auth/LoginService.tsx";
import {normalize} from "../../../shared/helpers";
import {Image} from "react-native";
import {logo} from "../../../assets/images";
import ErrorText from "../../../shared/component/ErrorText";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../../../shared/routes/stack";
import AuthSessionService from "../../../service/auth/AuthSessionService.tsx";
import Toast from "react-native-toast-message";

export default function Login() {

  const navigation = useNavigation<NavigationProps>();
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [email , setEmail] = useState('admin@store.com');
  const [password , setPassword] = useState('123456');
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
            Toast.show({
              type: 'success',
              text1: 'Account Verification',
              text2: 'Please verify your phone number to continue!',
              position : "top",
            });
            navigation.navigate('enterOTP'); // user have not verify there phone lets redirect to verify
          }else{
            Toast.show({
              type: 'success',
              text1: 'Account Login',
              text2: 'Login successful, please wait..',
              position : "top",
              onHide : () => {
              }
            });
            setTimeout(() => {
              navigation.navigate("tab");
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
      <Wrapper loading={isLoading}>
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
            <Button loading={isLoading} disabled={isLoading} onPress={doLogin}  loadingText="Signing In Please wait.." title="Sign In" />
          </View>
          <View style={styles.containerLink}>
            <Typography style={styles.alreadyAccount}>{"New user ?"}</Typography>
            <Typography onPress={signUp} style={styles.link}>{"Sign Up"}</Typography>
          </View>
        </View>
      </Wrapper>
  )
}

import React, {useState} from 'react';
import Wrapper from "@/shared/component/wrapper";
import Typography from "@/shared/component/typography";
import Input from "@/shared/component/input";
import {Image, View} from "react-native";
import { Button } from "@/shared/component/buttons";
import { styles } from "./styles";
import TitleAuth from "@/shared/component/titleAuth";
import Icon from "@/shared/component/icon";
import {eyeFilled, eyeOff, lock, mail, phone, user} from "@/assets/icons";
import {normalize} from "@/shared/helpers";
import {logo} from "@/assets/images";
import ErrorText from "@/shared/component/ErrorText";
import SignUpService from "@/service/auth/SignUpService.tsx";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/shared/routes/stack";

export default function CreateAccount() {
  const navigation = useNavigation<NavigationProps>()

  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [firstname , setFirstName] = useState('');
  const [lastname , setLastName] = useState('');
  const [password , setPassword] = useState('');
  const [email , setEmail] = useState('');
  const [phoneNumber , setPhoneNumber] = useState('');

  const [firstNameError , setFirstNameError] = useState('');
  const [lastNameError , setLastNameError] = useState('');
  const [passwordError , setPasswordError] = useState('');
  const [emailError , setEmailError] = useState('');
  const [phoneNumberError , setPhoneNumberError] = useState('');

  const [messageError, setMessageError] = useState('');

  const signUpService = new SignUpService();

  function goBackToSignIn() {
    if(navigation.canGoBack()){
      navigation.goBack();
    }
  }
  function doRegister(){

    let validationStatus = false;

    if(firstname === ''){
      setFirstNameError("First Name field is required");
      validationStatus = true;
    }
    if(lastname === ''){
      setLastNameError('Last Name field is required');
      validationStatus = true;
    }
    if(password === ''){
      setPasswordError('Password field is required');
      validationStatus = true;
    }
    if(phoneNumber === ''){
      setPhoneNumberError('Phone Number field is required');
      validationStatus = true;
    }
    if(email === ''){
      setEmailError("Email Address field is required");
      validationStatus = true;
    }

    if(!validationStatus) {
      setIsLoading(true)
      setEmailError('');
      setPasswordError('');
      setPhoneNumberError('');
      setFirstNameError('');
      setLastNameError('')
      signUpService.signUp(firstname, lastname, email, password, phoneNumber).then(function (response: any) {
        setIsLoading(false);

        if (response.status === false) {
          if (response.hasOwnProperty('email') && response.email !== false) {
            setEmailError(response.email);
          }

          if (response.hasOwnProperty('firstname') && response.firstname !== false) {
            setFirstNameError(response.firstname);
          }

          if (response.hasOwnProperty('lastname') && response.lastname !== false) {
            setLastNameError(response.lastname);
          }

          if (response.hasOwnProperty('phone') && response.phone !== false) {
            setPhoneNumberError(response.phone);
          }

          if (response.hasOwnProperty('password') && response.password !== false) {
            setPasswordError(response.password);
          }

          if (response.hasOwnProperty('message') && response.message !== false) {
            setMessageError(response.message);
          }
        } else {
          navigation.navigate('enterOTP');
        }
      }, function (error) {
        setIsLoading(false);
        if (error.hasOwnProperty('message') && error.message !== false) {
          setMessageError(error.message);
        }
      });
    }
  }


  return (
      <Wrapper loading={isLoading} titleLoader={"Signing Up Please wait..."}>
        <View style={styles.container}>
          <View style={styles.titleImageContainer}>
            <TitleAuth title="Create your Account" />
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
                  leftIcon={<Icon icon={user} />}
                  label="First Name"
                  value={firstname}
                  onChangeText={(firstname) => setFirstName(firstname)}
                  placeholder="Enter Your First Name"
              />
              {firstNameError !== '' ? <ErrorText>{firstNameError}</ErrorText> : ''}
            </View>

            <View style={styles.formControl}>
              <Input
                  leftIcon={<Icon icon={user} />}
                  label="Last Name"
                  value={lastname}
                  onChangeText={(lastname) => setLastName(lastname)}
                  placeholder="Enter Your Last Name"
              />
              {lastNameError !== '' ? <ErrorText>{lastNameError}</ErrorText> : ''}
            </View>

            <View style={styles.formControl}>
              <Input
                  leftIcon={<Icon icon={phone} />}
                  label="Phone Number"
                  keyboardType={"phone-pad"}
                  value={phoneNumber}
                  onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                  placeholder="Enter Your Phone Number"
              />
              {phoneNumberError !== '' ? <ErrorText>{phoneNumberError}</ErrorText> : ''}
            </View>

            <View style={styles.formControl}>
              <Input
                  leftIcon={<Icon icon={mail} />}
                  label="Email address"
                  keyboardType={"email-address"}
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
              {passwordError !== '' ? <ErrorText>{passwordError}</ErrorText> : ''}
            </View>
          </View>

          <View style={styles.formControl}>
            {messageError !== '' ?  <ErrorText textAlign={'center'} style={{marginBottom: 10}}>{messageError}</ErrorText> : <View/>}
            <Button title="Sign Up" loading={isLoading} disabled={isLoading}  onPress={doRegister}  loadingText="Sign Up" />
          </View>

          <View style={styles.containerLink}>
            <Typography style={styles.alreadyAccount}>{"Already have an account?"}</Typography>
            <Typography onPress={goBackToSignIn} style={styles.link}>{"Sign In"}</Typography>
          </View>
        </View>
      </Wrapper>
  )
}


import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/Login/LoginScreen';
import SignUpScreen from '../components/Signup/SignupScreen';
import ForgotPasswordScreen from '../components/ForgotPassword/ForgotPassword';
import HomeScreen from '../components/HomeScreen/HomeScreen';
import ScanNIDScreen from '../components/Signup/SignUpComponents/ScanNIDScreen';
import FaceVerificationScreen from '../components/Signup/FaceVerification/faceVerification';
import VerifyAccountScreen from '../components/Signup/VerifyAccount/VerifyAccount';
import ComplaintScreen from '../components/ComplaintScreen/ComplaintScreen';
import ComplaintDetailsScreen from '../components/ComplaintScreen/complaintDetails/ComplaintDetails';
import ComplaintsListScreen from '../components/ComplaintScreen/complaintList/ComplaintList';
import EditProfileScreen from '../components/ProfileScreen/profileScreen';
import AddRideScreen from '../components/RideAndPost/RideManagement/AddRideScreen';
import AddPostScreen from '../components/RideAndPost/PostManagement/AddPostScreen';

import ReviewsOverviewScreen from '../components/ReviewModule/screens/ReviewsOverviewScreen';
import WriteReviewScreen from '../components/ReviewModule/screens/WriteReviewScreen';
import ReviewsListScreen from '../components/ReviewModule/screens/ReviewsListScreen';
import ReviewPreviewScreen from '../components/ReviewModule/screens/ReviewPreviewScreen';

import ReviewCard from '../components/ReviewModule/ReviewCard';


const Stack = createStackNavigator();



const AppNavigator = () => {

  
    return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ScanNID" component={ScanNIDScreen} />
        <Stack.Screen name="FaceVerification" component={FaceVerificationScreen} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
        <Stack.Screen name="Complaint" component={ComplaintScreen} />
        <Stack.Screen name="ComplaintDetails" component={ComplaintDetailsScreen} />
        <Stack.Screen name="ComplaintList" component={ComplaintsListScreen} />
        <Stack.Screen name="Editprofile" component={EditProfileScreen} />
        <Stack.Screen name="addride" component={AddRideScreen} />
        <Stack.Screen name="addpost" component={AddPostScreen} />
        
       {/* Review screens with custom headers */}

      {/* Review screens */}
      <Stack.Screen 
        name="ReviewsOverview" 
        component={ReviewsOverviewScreen} 
        options={({ route }) => ({ 
          headerShown: true,
          title: route.params?.serviceName 
            ? `Reviews: ${route.params.serviceName}` 
            : 'Ratings & Reviews',
          headerStyle: { backgroundColor: '#1BBFB8' },
          headerTintColor: '#fff'
        })}
      />
      <Stack.Screen 
        name="WriteReview" 
        component={WriteReviewScreen}
        options={{
          headerShown: true,
          title: 'Write a Review',
          headerStyle: { backgroundColor: '#1BBFB8' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="ReviewPreview" 
        component={ReviewPreviewScreen}
        options={{
          headerShown: true,
          title: 'Review Preview',
          headerStyle: { backgroundColor: '#1BBFB8' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="ReviewsList" 
        component={ReviewsListScreen}
        options={{
          headerShown: true,
          title: 'All Reviews',
          headerStyle: { backgroundColor: '#1BBFB8' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
    );
};

export default AppNavigator;
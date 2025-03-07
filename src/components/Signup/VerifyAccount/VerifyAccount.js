import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmailVerification } from '../../../Redux/actions/AuthHandling/authActions';

export default function VerifyAccountScreen() {

    const dispatch = useDispatch();
    // Function to handle verification
    const handleVerify = () => {
        console.log('Verifying...');
        // You can add verification logic here, such as sending a verification email
        // For example:
         dispatch(sendEmailVerification());
        Alert.alert("Verification", "Verification logic is triggered.");
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <TouchableOpacity 
                onPress={handleVerify} 
                style={{ backgroundColor: '#28a745', borderRadius: 20, padding: 15, width: '80%', alignItems: 'center' }}
            >
                <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Verify</Text>
            </TouchableOpacity>
        </View>
    );
}




// export default function VerifyAccountScreen() {
//   const [code, setCode] = useState(['', '', '', '']);
//   const [timer, setTimer] = useState(15);
//   const [isVerified, setIsVerified] = useState(false);
//   const navigation = useNavigation();
//   const auth = getAuth(); // Firebase Authentication instance

//   useEffect(() => {
//     // Check if the user is already verified when the screen loads
//     const user = auth.currentUser;
//     if (user) {
//       setIsVerified(user.emailVerified);
//     }

//     const interval = setInterval(() => {
//       if (timer > 0) {
//         setTimer(timer - 1); // Decrease the timer each second
//       }
//     }, 1000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, [timer, auth]);

//   // Send verification email
//   const handleSendVerificationEmail = () => {
//     const user = auth.currentUser;
//     if (user && !user.emailVerified) {
//       sendEmailVerification(user)
//         .then(() => {
//           Alert.alert('Email sent!', 'Please check your email for verification.');
//         })
//         .catch((error) => {
//           console.error(error);
//           Alert.alert('Error', 'Failed to send verification email.');
//         });
//     }
//   };

//   // Handle the verification process
//   const handleVerify = async () => {
//     const user = auth.currentUser;

//     if (code.some((digit) => digit === '')) {
//       Alert.alert('Please enter all digits of the code');
//       return;
//     }

//     // Reload the user object to get updated info (in case email was verified)
//     await reload(user);

//     // Check if the email is verified
//     if (!user.emailVerified) {
//       Alert.alert('Email not verified', 'Please verify your email first.');
//       return;
//     }

//     // Proceed with verification logic after email is verified
//     navigation.navigate('Home');
//   };

//   return (
//     <LinearGradient colors={['#0AD1C8', '#073235']} className="flex-1 justify-center items-center p-5">
//       <Text className="text-4xl font-bold text-white text-center mb-10">Verify Your Account</Text>

//       {/* Email Verification Status */}
//       <View className="mb-6">
//         <Text className="text-white text-lg mb-2">
//           {isVerified ? 'Your email is verified!' : 'Your email is not verified.'}
//         </Text>
//         {!isVerified && (
//           <TouchableOpacity onPress={handleSendVerificationEmail} className="bg-yellow-500 rounded-xl py-2 px-6">
//             <Text className="text-black font-bold">Send Verification Email</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* OTP Input */}
//       <View className="flex-row justify-center mb-10 space-x-4">
//         {code.map((digit, index) => (
//           <TextInput
//             key={index}
//             style={{ width: 60, height: 60 }}
//             className="bg-white rounded-lg text-center text-2xl font-bold"
//             maxLength={1}
//             keyboardType="number-pad"
//             value={digit}
//             onChangeText={(value) => {
//               const newCode = [...code];
//               newCode[index] = value;
//               setCode(newCode);
//             }}
//           />
//         ))}
//       </View>

//       {/* Timer */}
//       <Text className="text-white text-lg mb-8">
//         Resend Code in <Text className="font-bold">{timer}</Text> Sec.
//       </Text>

//       {/* Verify Button */}
//       <TouchableOpacity
//         onPress={handleVerify}
//         className="bg-green-400 rounded-xl py-4 w-4/5 items-center"
//       >
//         <Text className="text-black text-lg font-bold">Verify</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const images = [
    require('../../../assets/images/carousel2.jpg'),
    require('../../../assets/images/carousel4.jpg'),
    require('../../../assets/images/carousel1.png')
];

const CarouselComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null); // Ref for ScrollView

    // Automatically change the carousel item every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop back to first image after the last one
        }, 3000); // Change the image every 3 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    // Use currentIndex to scroll to the correct position in the ScrollView
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: screenWidth * currentIndex, // Scroll to the correct image index
                animated: true,
            });
        }
    }, [currentIndex]); // Trigger scroll when currentIndex changes

    return (
        <View className="flex-1 justify-center items-center max-h-[20%] bg-black rounded-2xl max-w-screen-sm mx-4 overflow-hidden">
            {/* Horizontal Scroll */}
            <ScrollView
                ref={scrollViewRef} // Attach ref to ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                style={{ width: screenWidth }} // Ensure ScrollView matches screen width
            >
                {images.map((image, index) => (
                    <View
                        key={index}
                        style={{
                            width: screenWidth, // Match screen width
                            height: screenWidth * 0.5, // Adjust height ratio if needed
                        }}
                    >
                        <Image
                            source={image}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Indicator Dots */}
            <View className="flex-row justify-center absolute bottom-5">
                {images.map((_, index) => (
                    <View
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? 'bg-black' : 'bg-gray-500'}`}
                    />
                ))}
            </View>
        </View>
    );
};

export default CarouselComponent;

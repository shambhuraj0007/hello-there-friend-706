import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations = {
  en: {
    // Sidebar
    leaderboard: 'Leaderboard',
    payWaterBills: 'Pay Water Bills',
    payHomeBills: 'Pay Home Bills',
    anonymousReport: 'Anonymous Report',
    emergency: 'Emergency',
    changeLanguage: 'Change Language',
    
    // Navigation
    home: 'Home',
    myReports: 'My Reports',
    notifications: 'Notifications',
    profile: 'Profile',
    
    // Home screen
    appTitle: 'CivicConnect',
    makeVoiceHeard: 'Make Your Voice Heard',
    reportDescription: 'Report civic issues and earn rewards for community improvement',
    reported: 'Reported',
    resolved: 'Resolved',
    earned: 'Earned',
    issueMap: 'Issue Map',
    recentIssues: 'Recent Issues',
    issues: 'issues',
    noIssuesFound: 'No issues found matching your criteria',
    
    // Credits
    creditsWallet: 'Credits Wallet',
    availableCredits: 'Available Credits',
    redeemCredits: 'Redeem Credits',
    inviteFriends: 'Invite Friends',
    
    // Emergency numbers
    police: 'Police: 100',
    fire: 'Fire: 101',
    ambulance: 'Ambulance: 102',
    womenHelpline: 'Women Helpline: 1091',
    childHelpline: 'Child Helpline: 1098',
    
    // Anonymous report
    submitAnonymously: 'Submit Anonymously',
    anonymousDescription: 'Report issues without revealing your identity',
    
    // Leaderboard
    topCitizens: 'Top Citizens',
    thisMonth: 'This Month',
    yourRank: 'Your Rank',
    points: 'Points',
    citizen: 'Citizen',
    topPerformers: 'Top Performers',
    earnPoints: 'Earn Points',
    reportIssue: 'Report Issue',
    verifyReport: 'Verify Report',
    issueResolved: 'Issue Resolved',
    
    // Water Bills
    waterBillPayment: 'Water Bill Payment',
    payWaterBillDescription: 'Pay your water bills quickly and securely',
    findYourBill: 'Find Your Bill',
    consumerNumber: 'Consumer Number',
    enterConsumerNumber: 'Enter consumer number',
    searchBill: 'Search Bill',
    billDetails: 'Bill Details',
    consumerName: 'Consumer Name',
    address: 'Address',
    billMonth: 'Bill Month',
    dueDate: 'Due Date',
    totalAmount: 'Total Amount',
    selectPaymentMethod: 'Select Payment Method',
    choosePaymentMethod: 'Choose payment method',
    debitCard: 'Debit Card',
    creditCard: 'Credit Card',
    netBanking: 'Net Banking',
    wallet: 'Digital Wallet',
    payNow: 'Pay Now',
    processing: 'Processing...',
    billFound: 'Bill Found',
    billFoundMessage: 'Your bill details have been loaded successfully',
    billNotFound: 'Bill Not Found',
    invalidConsumerNumber: 'Please check your consumer number and try again',
    paymentSuccessful: 'Payment Successful',
    waterBillPaid: 'Your water bill has been paid successfully',
    paymentFailed: 'Payment Failed',
    tryAgainLater: 'Please try again later',
    billAlreadyPaid: 'This bill has already been paid',
    needHelp: 'Need Help?',
    waterBillHelpText: 'Contact customer support for assistance with your water bill',
    helpline: 'Helpline',
    pleaseEnterConsumerNumber: 'Please enter a valid consumer number',
    
    // Home Bills
    homeBillPayment: 'Home Bill Payment',
    payHomeBillDescription: 'Pay all your home utility bills in one place',
    selectBillType: 'Select Bill Type',
    billType: 'Bill Type',
    chooseBillType: 'Choose bill type',
    electricityBill: 'Electricity Bill',
    gasBill: 'Gas Bill',
    internetBill: 'Internet Bill',
    phoneBill: 'Phone Bill',
    accountNumber: 'Account Number',
    enterAccountNumber: 'Enter account number',
    provider: 'Provider',
    selectBillTypeAndNumber: 'Please select bill type and enter account number',
    invalidAccountNumber: 'Please check your account number and try again',
    homeBillPaid: 'Your home bill has been paid successfully',
    
    // Anonymous Report Enhancement
    photoUpload: 'Photo Upload',
    optional: 'Optional',
    takePhoto: 'Take Photo',
    photoCapture: 'Photo Captured',
    photoCaptured: 'Photo captured successfully',
    failedTakePhoto: 'Failed to take photo. Please try again.',
    getCurrentLocation: 'Get Current Location',
    locationCapture: 'Location Captured',
    locationCaptured: 'Current location captured successfully',
    gettingLocation: 'Getting Location...',
    failedGetLocation: 'Failed to get location. Please enter manually.',
    maxPhotosReached: 'Maximum 5 photos allowed',
    photoHelpText: 'Take clear photos showing the issue details',
    
    // Common
    error: 'Error',
  },
  hi: {
    // Sidebar
    leaderboard: 'लीडरबोर्ड',
    payWaterBills: 'पानी का बिल भरें',
    payHomeBills: 'घर का बिल भरें',
    anonymousReport: 'गुमनाम रिपोर्ट',
    emergency: 'आपातकाल',
    changeLanguage: 'भाषा बदलें',
    
    // Navigation
    home: 'होम',
    myReports: 'मेरी रिपोर्ट्स',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    
    // Home screen
    appTitle: 'सिविक कनेक्ट',
    makeVoiceHeard: 'अपनी आवाज़ उठाएं',
    reportDescription: 'नागरिक समस्याओं की रिपोर्ट करें और सामुदायिक सुधार के लिए पुरस्कार कमाएं',
    reported: 'रिपोर्ट किए गए',
    resolved: 'हल किए गए',
    earned: 'कमाए गए',
    issueMap: 'समस्या मानचित्र',
    recentIssues: 'हाल की समस्याएं',
    issues: 'समस्याएं',
    noIssuesFound: 'आपके मानदंडों से मेल खाने वाली कोई समस्या नहीं मिली',
    
    // Credits
    creditsWallet: 'क्रेडिट वॉलेट',
    availableCredits: 'उपलब्ध क्रेडिट',
    redeemCredits: 'क्रेडिट रिडीम करें',
    inviteFriends: 'दोस्तों को आमंत्रित करें',
    
    // Emergency numbers
    police: 'पुलिस: 100',
    fire: 'अग्निशमन: 101',
    ambulance: 'एम्बुलेंस: 102',
    womenHelpline: 'महिला हेल्पलाइन: 1091',
    childHelpline: 'बाल हेल्पलाइन: 1098',
    
    // Anonymous report
    submitAnonymously: 'गुमनाम रूप से जमा करें',
    anonymousDescription: 'अपनी पहचान छुपाए बिना समस्याओं की रिपोर्ट करें',
    
    // Leaderboard
    topCitizens: 'शीर्ष नागरिक',
    thisMonth: 'इस महीने',
    yourRank: 'आपकी रैंक',
    points: 'अंक',
    citizen: 'नागरिक',
    topPerformers: 'शीर्ष प्रदर्शनकर्ता',
    earnPoints: 'अंक कमाएं',
    reportIssue: 'समस्या रिपोर्ट करें',
    verifyReport: 'रिपोर्ट सत्यापित करें',
    issueResolved: 'समस्या हल हुई',
    
    // Water Bills
    waterBillPayment: 'पानी का बिल भुगतान',
    payWaterBillDescription: 'अपने पानी के बिल जल्दी और सुरक्षित रूप से भरें',
    findYourBill: 'अपना बिल खोजें',
    consumerNumber: 'उपभोक्ता संख्या',
    enterConsumerNumber: 'उपभोक्ता संख्या दर्ज करें',
    searchBill: 'बिल खोजें',
    billDetails: 'बिल विवरण',
    consumerName: 'उपभोक्ता नाम',
    address: 'पता',
    billMonth: 'बिल महीना',
    dueDate: 'देय तिथि',
    totalAmount: 'कुल राशि',
    selectPaymentMethod: 'भुगतान विधि चुनें',
    choosePaymentMethod: 'भुगतान विधि चुनें',
    debitCard: 'डेबिट कार्ड',
    creditCard: 'क्रेडिट कार्ड',
    netBanking: 'नेट बैंकिंग',
    wallet: 'डिजिटल वॉलेट',
    payNow: 'अभी भुगतान करें',
    processing: 'प्रसंस्करण...',
    billFound: 'बिल मिला',
    billFoundMessage: 'आपका बिल विवरण सफलतापूर्वक लोड हो गया है',
    billNotFound: 'बिल नहीं मिला',
    invalidConsumerNumber: 'कृपया अपनी उपभोक्ता संख्या जांचें और पुनः प्रयास करें',
    paymentSuccessful: 'भुगतान सफल',
    waterBillPaid: 'आपका पानी का बिल सफलतापूर्वक भुगतान हो गया है',
    paymentFailed: 'भुगतान असफल',
    tryAgainLater: 'कृपया बाद में पुनः प्रयास करें',
    billAlreadyPaid: 'यह बिल पहले से भुगतान हो चुका है',
    needHelp: 'सहायता चाहिए?',
    waterBillHelpText: 'अपने पानी के बिल के लिए सहायता हेतु ग्राहक सेवा से संपर्क करें',
    helpline: 'हेल्पलाइन',
    pleaseEnterConsumerNumber: 'कृपया एक वैध उपभोक्ता संख्या दर्ज करें',
    
    // Home Bills
    homeBillPayment: 'घरेलू बिल भुगतान',
    payHomeBillDescription: 'अपने सभी घरेलू उपयोगिता बिल एक स्थान पर भरें',
    selectBillType: 'बिल प्रकार चुनें',
    billType: 'बिल प्रकार',
    chooseBillType: 'बिल प्रकार चुनें',
    electricityBill: 'बिजली का बिल',
    gasBill: 'गैस का बिल',
    internetBill: 'इंटरनेट का बिल',
    phoneBill: 'फोन का बिल',
    accountNumber: 'खाता संख्या',
    enterAccountNumber: 'खाता संख्या दर्ज करें',
    provider: 'प्रदाता',
    selectBillTypeAndNumber: 'कृपया बिल प्रकार चुनें और खाता संख्या दर्ज करें',
    invalidAccountNumber: 'कृपया अपनी खाता संख्या जांचें और पुनः प्रयास करें',
    homeBillPaid: 'आपका घरेलू बिल सफलतापूर्वक भुगतान हो गया है',
    
    // Anonymous Report Enhancement
    photoUpload: 'फोटो अपलोड',
    optional: 'वैकल्पिक',
    takePhoto: 'फोटो लें',
    photoCapture: 'फोटो कैप्चर',
    photoCaptured: 'फोटो सफलतापूर्वक कैप्चर हो गई',
    failedTakePhoto: 'फोटो लेने में असफल। कृपया पुनः प्रयास करें।',
    getCurrentLocation: 'वर्तमान स्थान प्राप्त करें',
    locationCapture: 'स्थान कैप्चर',
    locationCaptured: 'वर्तमान स्थान सफलतापूर्वक कैप्चर हो गया',
    gettingLocation: 'स्थान प्राप्त कर रहे हैं...',
    failedGetLocation: 'स्थान प्राप्त करने में असफल। कृपया मैन्युअल रूप से दर्ज करें।',
    maxPhotosReached: 'अधिकतम 5 फोटो की अनुमति है',
    photoHelpText: 'समस्या का विवरण दिखाने वाली स्पष्ट तस्वीरें लें',
    
    // Common
    error: 'त्रुटि',
  },
  mr: {
    // Sidebar
    leaderboard: 'लीडरबोर्ड',
    payWaterBills: 'पाण्याचे बिल भरा',
    payHomeBills: 'घराचे बिल भरा',
    anonymousReport: 'गुमनाम अहवाल',
    emergency: 'आणीबाणी',
    changeLanguage: 'भाषा बदला',
    
    // Navigation
    home: 'होम',
    myReports: 'माझे अहवाल',
    notifications: 'सूचना',
    profile: 'प्रोफाइल',
    
    // Home screen
    appTitle: 'सिविक कनेक्ट',
    makeVoiceHeard: 'तुमचा आवाज उंचावा',
    reportDescription: 'नागरी समस्यांचा अहवाल द्या आणि समुदायिक सुधारणेसाठी बक्षिसे मिळवा',
    reported: 'अहवाल दिलेले',
    resolved: 'सोडवलेले',
    earned: 'कमावले',
    issueMap: 'समस्या नकाशा',
    recentIssues: 'अलीकडील समस्या',
    issues: 'समस्या',
    noIssuesFound: 'तुमच्या निकषांशी जुळणाऱ्या कोणत्या समस्या सापडल्या नाहीत',
    
    // Credits
    creditsWallet: 'क्रेडिट वॉलेट',
    availableCredits: 'उपलब्ध क्रेडिट',
    redeemCredits: 'क्रेडिट रिडीम करा',
    inviteFriends: 'मित्रांना आमंत्रित करा',
    
    // Emergency numbers
    police: 'पोलिस: 100',
    fire: 'अग्निशामक: 101',
    ambulance: 'रुग्णवाहिका: 102',
    womenHelpline: 'महिला हेल्पलाइन: 1091',
    childHelpline: 'बाल हेल्पलाइन: 1098',
    
    // Anonymous report
    submitAnonymously: 'गुमनामपणे सबमिट करा',
    anonymousDescription: 'तुमची ओळख लपवून समस्यांचा अहवाल द्या',
    
    // Leaderboard
    topCitizens: 'शीर्ष नागरिक',
    thisMonth: 'या महिन्यात',
    yourRank: 'तुमची रँक',
    points: 'गुण',
    citizen: 'नागरिक',
    topPerformers: 'शीर्ष कामगिरी करणारे',
    earnPoints: 'गुण मिळवा',
    reportIssue: 'समस्या नोंदवा',
    verifyReport: 'अहवाल सत्यापित करा',
    issueResolved: 'समस्या सोडवली',
    
    // Water Bills
    waterBillPayment: 'पाण्याचे बिल भरणे',
    payWaterBillDescription: 'तुमचे पाण्याचे बिल लवकर आणि सुरक्षितपणे भरा',
    findYourBill: 'तुमचे बिल शोधा',
    consumerNumber: 'ग्राहक क्रमांक',
    enterConsumerNumber: 'ग्राहक क्रमांक टाका',
    searchBill: 'बिल शोधा',
    billDetails: 'बिल तपशील',
    consumerName: 'ग्राहक नाव',
    address: 'पत्ता',
    billMonth: 'बिल महिना',
    dueDate: 'देय तारीख',
    totalAmount: 'एकूण रक्कम',
    selectPaymentMethod: 'पेमेंट पद्धत निवडा',
    choosePaymentMethod: 'पेमेंट पद्धत निवडा',
    debitCard: 'डेबिट कार्ड',
    creditCard: 'क्रेडिट कार्ड',
    netBanking: 'नेट बँकिंग',
    wallet: 'डिजिटल वॉलेट',
    payNow: 'आता भरा',
    processing: 'प्रक्रिया सुरू आहे...',
    billFound: 'बिल सापडले',
    billFoundMessage: 'तुमचे बिल तपशील यशस्वीरित्या लोड झाले आहेत',
    billNotFound: 'बिल सापडले नाही',
    invalidConsumerNumber: 'कृपया तुमचा ग्राहक क्रमांक तपासा आणि पुन्हा प्रयत्न करा',
    paymentSuccessful: 'पेमेंट यशस्वी',
    waterBillPaid: 'तुमचे पाण्याचे बिल यशस्वीरित्या भरले गेले आहे',
    paymentFailed: 'पेमेंट अयशस्वी',
    tryAgainLater: 'कृपया नंतर पुन्हा प्रयत्न करा',
    billAlreadyPaid: 'हे बिल आधीच भरलेले आहे',
    needHelp: 'मदत हवी आहे?',
    waterBillHelpText: 'तुमच्या पाण्याच्या बिलासाठी मदतीसाठी ग्राहक सेवेशी संपर्क साधा',
    helpline: 'हेल्पलाइन',
    pleaseEnterConsumerNumber: 'कृपया एक वैध ग्राहक क्रमांक टाका',
    
    // Home Bills
    homeBillPayment: 'घरगुती बिल भरणे',
    payHomeBillDescription: 'तुमची सर्व घरगुती उपयोगिता बिले एकाच ठिकाणी भरा',
    selectBillType: 'बिल प्रकार निवडा',
    billType: 'बिल प्रकार',
    chooseBillType: 'बिल प्रकार निवडा',
    electricityBill: 'वीज बिल',
    gasBill: 'गॅस बिल',
    internetBill: 'इंटरनेट बिल',
    phoneBill: 'फोन बिल',
    accountNumber: 'खाते क्रमांक',
    enterAccountNumber: 'खाते क्रमांक टाका',
    provider: 'प्रदाता',
    selectBillTypeAndNumber: 'कृपया बिल प्रकार निवडा आणि खाते क्रमांक टाका',
    invalidAccountNumber: 'कृपया तुमचा खाते क्रमांक तपासा आणि पुन्हा प्रयत्न करा',
    homeBillPaid: 'तुमचे घरगुती बिल यशस्वीरित्या भरले गेले आहे',
    
    // Anonymous Report Enhancement
    photoUpload: 'फोटो अपलोड',
    optional: 'पर्यायी',
    takePhoto: 'फोटो काढा',
    photoCapture: 'फोटो कॅप्चर',
    photoCaptured: 'फोटो यशस्वीरित्या कॅप्चर झाला',
    failedTakePhoto: 'फोटो काढण्यात अयशस्वी। कृपया पुन्हा प्रयत्न करा.',
    getCurrentLocation: 'सध्याचे स्थान मिळवा',
    locationCapture: 'स्थान कॅप्चर',
    locationCaptured: 'सध्याचे स्थान यशस्वीरित्या कॅप्चर झाले',
    gettingLocation: 'स्थान मिळवत आहे...',
    failedGetLocation: 'स्थान मिळवण्यात अयशस्वी. कृपया मॅन्युअली एंटर करा.',
    maxPhotosReached: 'जास्तीत जास्त 5 फोटोंची परवानगी आहे',
    photoHelpText: 'समस्येचा तपशील दाखवणारे स्पष्ट फोटो काढा',
    
    // Common
    error: 'त्रुटी',
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (savedLanguage && ['en', 'hi', 'mr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
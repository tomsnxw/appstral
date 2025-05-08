import { StyleSheet, Dimensions } from 'react-native'; 

const { height, width } = Dimensions.get('screen'); 
const { height: wHeight, width: wWidth } = Dimensions.get('window');
export const createStyles = (theme) => {
  return StyleSheet.create({
    gradientBottom: {
      position: 'absolute',
      bottom: (height - wHeight) -55,
      left: 0,
      right: 0,
      height: (height - wHeight) + 120, 
      zIndex: 1
    },
    homeGradientContainer:{
      height: height
      },
    homeContainer:{
      height: height,
      paddingTop: height*.005
    },
  maskedView: {
    width: '100%',
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeName: {
    fontSize: height*0.036,
    fontFamily: 'Effra_Regular', 
    textAlign: 'center',
    backgroundColor: 'transparent', 
    
  },
  skyStarsTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: height*0.065,
    height: 100, 
    transform: [{translateX: -10}, {scale: 0.97}],
    width: '100%',
  },
  skyStarsBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: height*-0.00,
    transform: [{ scaleX: -1 },{translateX: 2}, {scale: 0.95}],
    height: 100, 
    width: '100%',
  },
  resultCircle:{
    justifyContent: 'center',
    alignSelf: 'center',
    height: width * 0.95,
    width: width * 0.95,
    marginVertical: 10,
  },
  welcomeText:{
    fontSize: height*0.02,
    textAlign: 'center',
    fontFamily: 'Effra_Regular', 
    color: theme.primary,
    lineHeight: height*0.025,
  },
  title: {
    fontFamily: 'Effra_Regular', 
    fontSize: 24,
    marginBottom: 20,
  },
  homeResult: {
    borderRadius: 5,
  },
  homeResultList: {
    paddingLeft: width*0.15,
  },
  homeResultListSpace:{
    height: height*0.225,
  },
  
  resetIcon:{
    width: height*0.02, 
    height: height*0.02,
    margin: 'auto',
    fill: theme.secondary,
  },
  fechaButtons:{
    display: 'flex',
    flexDirection: 'row',
    gap: 5,    
   marginVertical: 10,
    marginHorizontal: 'auto',
  },
  fechaButton:{
    backgroundColor: 'transparent',
    borderRadius: 100,
    elevation: 0,
    shadowColor: 'transparent', 
    borderColor: theme.secondaryBorder,
    borderWidth: 1,
    width: height*0.04, 
    height: height*0.04,
    justifyContent: 'center'
  },
  fechaModo:{
    backgroundColor: 'transparent',
    borderRadius: 50,
    elevation: 0,
    width: height*0.12,
    height: height*0.04,
    shadowColor: 'transparent', 
    borderColor: theme.secondaryBorder,
    borderWidth: 1,
    justifyContent: 'center'
  },
  titleModoButton: {
    fontSize: height*0.015,
    color: theme.secondary,
    lineHeight: height*0.039,
    fontFamily: 'Effra_Regular',
        textAlign: 'center'
  },
  titleButton: {
    fontSize: height*0.02,
    color: theme.secondary,
    lineHeight: height*0.039,
    fontFamily: 'Effra_Light',
    textAlign: 'center'
  },
  fechaText: {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'Effra_Regular',
    color: theme.primary,
    fontSize: height*0.016,
  },

  
profileContainer: {
  gap: 20,
  height: '100%',
  marginTop: 'auto',
  marginBottom: 0,
  backgroundColor: theme.red
},
switchSelector: {
  flexDirection: "row",
  marginHorizontal: 'auto',
  alignItems: "center",
  marginVertical: 10
},
switchOption: {
  flexDirection: "column",
  alignItems: "center",
  marginHorizontal: 10,
  gap: 5,
  minWidth: width*.15,
},
radioButton: {
  width: height*.025, 
  height: height*.025,
  borderRadius: 50,
  borderWidth: 1,
  backgroundColor: theme.grey,
  borderColor: theme.secondary,
  justifyContent: "center",
  alignItems: "center",
},
innerSwitchCircle: {
  width: height*.011, 
  height: height*.011,
  borderRadius: 50, 
  backgroundColor: theme.border, 
},
selectedRadio: {
  backgroundColor: "#007AFF",
},
switchText: {
  fontFamily: 'Effra_Regular',
  fontSize: height*.017,
  color: theme.secondary,
},
changePasswordContainer: {
},
changePasswordForm: {
  overflow: 'hidden',  
},
scrollContainer: {
  paddingVertical: 15
},
inputProfileContainer: {
  borderBottomWidth: height*.000325,
  borderColor: theme.secondaryBorder,
  marginLeft: 50,
},
profilePasswordInput: {
  color:  theme.secondaryBorder,
  fontSize: 18,
  fontFamily: 'Effra_Light',
},
changeButton: {
  color: theme.background,
  backgroundColor: theme.black,
  fontSize: 16,
  fontFamily: 'Effra_Regular',
  width: 120,
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 20,
  marginVertical: 15,
  paddingBottom: 7,
  paddingTop: 10,
  borderRadius: 100
},
profileButtonText: {
  color: theme.primary,
  fontSize: height*.02,
  marginVertical: 'auto',
  fontFamily: 'Effra_Regular',
  marginLeft: 20,
},
buttonPicker:{
  marginRight: 'auto',
  marginLeft: width*0.1,
  borderColor: theme.primaryBorder,
  width: 225,
},
buttonPickerItem:{
  marginHorizontal: 20,
  color: theme.secondaryBorder,
  fontSize: height*.02,
  fontFamily: 'Effra_Light',
},
buttonRedText: {
  color: theme.red,
  fontSize: 18,
  fontFamily: 'Effra_Regular',
  marginBottom: 0,
  marginLeft: 20
},
ProfileNameContainer:{
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
},
ProfileInfoContainer:{
textAlign: 'center',
marginHorizontal: 'auto',
marginTop: 20,
marginBottom: 25,
},
PremiumProfileInfoContainer:{
marginTop: 15,
marginBottom: 0
},
PremiumName:{
  
},
ProfileName:{
marginHorizontal: 0,
fontSize: height*.032,
fontFamily: 'Effra_Light',
marginVertical: 'auto',
color: theme.primary,
maxWidth: width*.8
},

changeEmailText:{
  textAlign: 'center',
  marginVertical: 'auto',
  fontSize: 20,
  textDecorationLine: 'none',
  fontFamily: 'Effra_Light',
  color: theme.primary
  },
  changeEmailInput:{
    textAlign: 'center',
    marginVertical: 'auto',
    fontSize: 19,
    textDecorationLine: 'underline',
    fontFamily: 'Effra_Light',
  color: theme.primary
    },
    changeEmailInputIcon:{
      fontSize: 20,
      marginVertical: 'auto',
       color:theme.secondary 
      },

  changeEmailIcon:{
    width: 20,
    marginBottom: 7,
     fill: theme.secondary 
  },
ProfileInfo:{
  textAlign: 'center',
  marginHorizontal: 'auto',
  fontSize: 18,
  fontFamily: 'Effra_Regular',
  lineHeight: height*0.025, 
  color: theme.secondary,

  
  },
  PremiumInfo:{
    textAlign: 'center',
    marginHorizontal: 'auto',
    fontSize: height*0.017,
    fontFamily: 'Effra_Regular',
    lineHeight: height*0.017,
    color: theme.black,
    marginBottom: 10
    },
  profileEmailText:{
    flexDirection: 'row',
    margin: 'auto',
    gap:10
  },
  ProfileEmail:{
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Effra_Light',
    paddingTop: 15,
    paddingBottom: 7.5,
    color: theme.primary
    },
  
modalTitle: {
fontSize: 20,
color: '#f2f2f2',
fontFamily: 'Effra_Regular',
paddingVertical: 15,
marginHorizontal: 'auto'
},
modalText: {
fontSize: 15,
fontFamily: 'Effra_Regular',
textAlign: "start",
color: '#f2f2f2',
paddingLeft: 10
},
modalInput: {
marginBottom: 15,
paddingBottom: 3,
paddingHorizontal: 20,
paddingTop: 5,
borderRadius: 20,
borderWidth: .5,
borderColor: theme.sheetBorder,
backgroundColor: theme.background,
color: theme.secondary,
fontSize: 16,
fontFamily: 'Effra_Regular',
},
modalPickerContainer: {
},
modalPicker: {
color: theme.secondary,
fontFamily: 'Effra_Regular',
marginVertical: 'auto',
transform: [
  { translateY: -10 },

],
}, 
modalView: {
  width: width,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  paddingHorizontal: 20,
},
modalDatePicker: {
height: 30,
backgroundColor: theme.background,
marginTop: 5,
marginBottom: 15,
padding: 0,
width: width*0.9,
borderRadius: 20,
borderWidth: .5,
borderColor: theme.sheetBorder,
fontFamily: 'Effra_Regular',
fontSize: 14,
margin: 'auto'
},
modalTitleDatePicker: {
color: theme.secondary,
fontSize: 14,
fontFamily: 'Effra_Regular',
padding: 0,
margin: 0
},
modalButtonContainer: {
borderRadius: 25, 
overflow: 'hidden', 
alignSelf: 'center'
},
modalButtonEditText: {
fontSize: 15,
fontFamily: 'Effra_Regular',
color: theme.alwaysWhite,
transform: [
  { translateY: 1 }
],
},
gradientBackground: {
paddingVertical: 7,
paddingHorizontal: 35,
borderRadius: 100, 
alignItems: 'center',
},
modalCloseButton: {
backgroundColor: theme.red,
width: 50,
height: 50,
marginTop: 15,
borderRadius: 50,
alignContent: 'center',
justifyContent: 'center',
alignItems: 'center',
marginHorizontal: 'auto',
},
modalCloseButtonIcon: {
fill: theme.alwaysWhite,
width: 12,
height: 12,
margin: 'auto',
transform: [{ rotate: '45deg' }]
},
dropdownBox:{
  height: height*0.045,
  borderRadius: 20,
},
dropdownList:{
  position: 'absolute', 
  top: height*0.04,
  width: width*0.85,
  alignSelf: 'center',
  maxHeight: height*0.2, 
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
  elevation: 3, 
  zIndex: 3
},
inputStyles:{
  color: '#999999',
  fontFamily: 'Effra_Regular',
  fontSize: height*0.016,
  lineHeight: height*0.017,
  },
dropdownTextStyles:{
  color: '#999999',
  fontSize: height*0.016,
  fontFamily: 'Effra_Regular',
},
gradient: {
  ...StyleSheet.absoluteFillObject, 
},
homeWelcomeTitles:{
  width: '100%',
},
myChartContainer: {
  margin: 'auto',
  marginTop: height*.125,
height: height,
width: width,
backgroundColor: theme.background
},
chartResultList: {
  paddingLeft: width*0.15,
},
resultCircle:{
  alignSelf: 'center',
},
ChartHeader:{
 width: width*.9,
margin: 'auto',
paddingTop: 15,
marginTop: 0,
gap: 7.5
},
chartInfoSeparator:{
height:20,
width: 2,
backgroundColor: theme.primaryBorder,
},

chartTitle:{
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
chartOptions:{
flexDirection: 'row',
gap: 15,
marginVertical: 'auto'
},
ChartInfo:{
margin: 'auto',
width: width*.9,
flexDirection: 'row',
justifyContent: 'space-evenly',
},
  ChartInfoTime:{
    maxWidth: width*.25,
    textAlign: 'center',
    fontSize: height*0.018,
    fontFamily: 'Effra_Regular',
    color: theme.secondary,
    },

    skeletonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 15,
      gap: 10,
      borderRadius: 10,
    },
    remainingCharts:{
      width: height*.026,
      height: height*.026,
      backgroundColor: theme.red,
      position: 'absolute',
      bottom: (height - wHeight) + height * 0.1,
      borderRadius: 50,
      zIndex: 2,
      right: width*0.42,
      justifyContent: 'center'
    },
    remainingChartsText:{
width: height*.026,
        height: height*.026,
        backgroundColor: theme.red,
        position: 'absolute',
        bottom: (height - wHeight) + height * 0.2375,
        textAlign: 'center',
        fontFamily: 'Effra_Medium',
      color: theme.alwaysWhite,
      fontSize: height*0.018,
        borderRadius: 50,
        zIndex: 2,
        right: width*0.42,
        justifyContent: 'center'
    },
    skeletonCircle: {
      width: height*0.055,
      height: height*0.055,
      borderRadius: 25,
      backgroundColor: "#e6e6e6",
      marginTop: 0,
      margin: 'auto'
    },
    skeletonTextContainer: {
      flex: 1,
      marginBottom: 5
    },
    skeletonLine: {
      height: 15,
      backgroundColor: "#e6e6e6",
      borderRadius: 4,
      marginVertical: 5,
    },
    modalOptionContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
      justifyContent: 'flex-end',
    },
    modalOptionContent: {
      justifyContent: 'center',
      height: height*0.325,
      justifyContent: 'flex-start',
      backgroundColor: theme.editSheet,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    },
    modalOptionSlider: {
      justifyContent: 'center',
      height: 2,
      marginVertical: 20,
      width: width*0.1,
      marginHorizontal: 'auto',
      backgroundColor: theme.secondaryBorder
    },
  
  myChartsContainer: {
    marginVertical: 'auto',
    marginBottom: 0,
  height: height*0.88,
  backgroundColor: theme.background
  },
  chartContainer: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 10,
  backgroundColor: theme.background,
  },
  scrollableChartContainer:{
  
  },
  chartInfoContainer:{
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginLeft: width*0.05,
  },
  chartNameContainer:{
    flexDirection: 'row',
    gap: 6,
    zIndex: 2,
    transform: [{translateX: - width*0.05}]
  },
  chartName: {
  fontSize: height*.021,
  fontFamily: 'Effra_Regular', 
  color: theme.primary,
  width: width*0.8,
  },
  chartText: {
  fontSize: height*.021,
  fontFamily: 'Effra_Regular', 
  color: theme.secondaryBorder
  },
  specialChartIconContainer:{
    marginRight: width*0.04,
    width: width*0.07,
    height: width*0.07,
    justifyContent: 'center'
    },
  chartOptionsIconContainer:{
  marginRight: width*0.04,
  width: width*0.07,
  height: width*0.07,
  },
  chartOptionsIcon:{
    width: width*0.04,
    height: width*0.04,
    margin: 'auto',
    fill: theme.secondary
    },
    specialChartIcon:{
      width: width*0.05,
      height: width*0.05,
      margin: 'auto',
      fill: '#6cbcf0',
      },
  option:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  fontSize: 15,
  padding: 11,
  paddingHorizontal: 15,
  marginVertical: 2,
  },
  optionText:{
  fontSize: 16,
  color: theme.primary,
  fontFamily: 'Effra_Medium',
  },
  optionDeleteText:{
  fontSize: 16,
  color: theme.red,
  fontFamily: 'Effra_Medium',
  },
  chartsSeparator:{
    paddingVertical: height*.0005,
    backgroundColor: theme.primaryBorder,
    marginLeft: width*0.05,
  },
  separatorBar:{
    height:height*0.001,
    backgroundColor: theme.primaryBorder,
  marginHorizontal: 15
  },
  sortChartButtonsContainer: {
  position: 'absolute',  
  left: 0,
  right: 0,
  top: height*.005,
  
  },
  sortChartButtons:{
    height: height*.09,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortChartButton: {
    height:height*.035,
     borderColor: theme.secondary,
    width: 'auto',
    backgroundColor: theme.background,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginTop: 5,
    borderWidth: 1
  },
  activeSortChartButton: {
  backgroundColor: theme.black, 
  borderColor: theme.black,
  marginTop: 5,
  },
  sortChartbuttonText: {
  color: theme.primary,
  fontFamily: 'Effra_Regular',
  margin: 'auto',
  fontSize: height*0.015,
  lineHeight: height*0.035
  },
  activeSortChartButtonText: {
  color: theme.background,
  fontFamily: 'Effra_Regular',
  margin: 'auto',
  fontSize: height*0.015,
  lineHeight: height*0.035
  },
  optionsContainer:{
  backgroundColor: theme.background,
  marginHorizontal: 15,
  borderRadius: 20,
  },
  AddChartModalButton: {
  position: 'absolute',
  alignSelf: 'center',
  bottom: (height - wHeight) + height * 0.1,
  width: 50,
  height: 50,
  borderRadius: 50,
  zIndex: 2,
    },
  AddChartModalButtonIconContainer: {
  width: 50,
  height: 50
  },
  AddChartModalButtonIcon: {
  fill: theme.alwaysWhite,
  width: 12,
  height: 12,
  margin: 'auto'
  },
  noChartsContainer:{
  flex: 1,
  textAlign: 'center',
  gap: 25,
  paddingTop: height*0.21,
  
  },
  noChartsText:{
  textAlign: 'center',
  fontFamily: 'Effra_Light',
  fontSize: height*0.04,
  color: theme.secondaryBorder
  },
  noChartsIcon: {
    width: width*0.4,
    height: width*0.4,
  marginHorizontal: 'auto',
  textAlign: 'center',
  fill: theme.secondaryBorder
  },
  chartFooter:{
    height: height*0.4,
  },

resultCircle:{
  alignSelf: 'center',
},
ChartInfo:{
  margin: 'auto',
  width: width*.9,
  paddingTop: 5,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
},
chartInfoSeparator:{
height:20,
width: 2,
backgroundColor: theme.primaryBorder,
},
chartDetailsContainer: {
  margin: 'auto',
  marginBottom: 0,
height: height*0.875,
width: width,
backgroundColor: theme.background
},
specialChartDetailsHeader:{
  width: width*.9,
  margin: 'auto',
  paddingTop: 17,
  marginTop: 0,
  gap: 10
},
ChartDetailsHeader:{
  width: width*.9,
  margin: 'auto',
  paddingTop: 17,
  marginTop: 0,
  gap: 10
},
chartTitle:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
ChartTitleText: {
 maxWidth: width*.6, 
  color: theme.black,
  fontSize: height*0.025,
  textAlign: 'left',
  fontFamily: 'Effra_Regular',
  alignContent: 'center',
  alignItems: 'center'

},
specialChartOptions:{
  flexDirection: 'row',
  gap: 15,
  margin: 0,
  marginVertical: 'auto',
  },
chartOptions:{
  flexDirection: 'row',
  gap: 15,
  marginVertical: 'auto',
  },
specialChartTitleText:{
  maxWidth: width*.6, 
  color: theme.black,
  fontSize: height*0.025,
  textAlign: 'left',
  fontFamily: 'Effra_Regular',
},

  chartResultList: {
    paddingLeft: width*0.15,
  },
ChartInfo:{
  margin: 'auto',
  width: width*.92,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  },
 specialChartInfo:{
    margin: 'auto',
    width: width*.8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    },
  ChartInfoText:{
    minWidth: width*.2,
    maxWidth: width*.3,
    textAlign: 'left',
    fontSize: height*0.018,
    fontFamily: 'Effra_Regular',
    color: theme.secondary,
    },
    ChartInfoTime:{
      maxWidth: width*.25,
      textAlign: 'center',
      fontSize: height*0.018,
      fontFamily: 'Effra_Regular',
      color: theme.secondary,
      },
      chartResultListSpace:{
        height: height*0.325
      },

      policyScrollContainer: {
        paddingHorizontal: 20,
        paddingVertical: 40
      },
      policyContainer: {
      height: height,
      marginBottom: 0,
      marginTop: 'auto',
      backgroundColor: theme.background,
      flexDirection: 'row'
      },
      scrollBottomSpace:{
        height: height*.45
      },
      policyHeader:{
        paddingLeft: 20, paddingVertical: 40
      },
      backArrow:{
        backgroundColor: theme.grey,
        padding: 8,
        borderRadius: 100,
        borderWidth: .75,
        borderColor: theme.border,
      },
      backArrowIcon:{
        width:11,
        height: 11,
      },
      policyTitle: {
        marginVertical: 'auto',
        fontFamily: 'Effra_Medium',
        fontSize: 20,
        color: theme.primary,
        marginBottom: 10
      },
      policySectionTitle: {
        
        fontFamily: 'Effra_Bold',
       fontSize: 16,
       color: theme.primary,
       marginVertical: 15
      },
      policySectionText: {
        
        fontFamily: 'Effra_Regular',
       fontSize: 16,
       color: theme.primary
      },
      calculateContainer: {
        height:height,
        backgroundColor: theme.background
      },
      calculateForm:{
        justifyContent: 'space-between',
        gap: 15,
         marginHorizontal: 'auto',
         paddingBottom: height*0.1
    
      },
      calculateFormTitle: {
        fontSize: width*.1,
        maxWidth: width*.7,
        color: theme.primary,
        fontFamily: 'Effra_Light',
        paddingVertical: 15,
        textAlign: 'center',
        marginHorizontal: 'auto'
      },
      calculateText: {
        fontSize: height*0.015,
        fontFamily: 'Effra_Regular',
        textAlign: "start",
        color: theme.secondary,
        paddingLeft: 10,
      },
      inputContainer: {
        height: height*0.045,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: theme.secondary,
        borderRadius: 50,
        paddingHorizontal: 15,
        textAlign: 'center',
        justifyContent: 'center',
        width: width*.9
      },
      focusedBorder:{
        borderWidth: 1,
        borderColor: theme.black,
      },
      defaultBorder:{
        borderWidth: 1,
        borderColor: theme.secondary,
      },
      focusedText:{
        color: theme.black,
      },
      defaultText:{
        color: theme.secondary,
      },
      CalculateInput: {
        flex: 1,
        fontSize: height*0.016,
        height: height*0.046,
        fontFamily: 'Effra_Regular',
        color: theme.secondary,
      },
      inputDateTime: {
        paddingHorizontal: 75,
        fontSize: height*0.016,
        height: height*0.046,
        fontFamily: 'Effra_Regular',
        textAlign: 'center',
        color: theme.secondary,
      },
    
      dropdownBox:{
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderWidth: 1,
        marginTop: 15,
        marginHorizontal: 10,
        borderColor: theme.secondary,
        backgroundColor: theme.background,
        color: theme.secondary,
        fontSize: 16,
        fontFamily: 'Effra_Regular',
      },
      dropdownList:{
        width: width*.83,
        alignSelf: 'center',
        maxHeight: height*0.15, 
        borderWidth: 1,
        borderColor: theme.secondary,
        borderRadius: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      inputStyles:{
        color: theme.secondary,
        fontFamily: 'Effra_Regular',
        fontSize: height*0.016,
        lineHeight: height*0.017,
        },
      dropdownTextStyles:{
        color: theme.secondary,
        fontSize: height*0.016,
        fontFamily: 'Effra_Regular',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5
      },
      searchTextInputStyles:{
        color: 'red',
        fontSize: height*0.016,
        fontFamily: 'Effra_Regular',
      },
      titleDatePicker: {
        color: theme.secondary,
        fontSize: height*0.016,
        fontFamily: 'Effra_Regular',
        padding: 0,
        margin: 0
      },
      calculateButtonContainer: {
        borderRadius: 25, 
        overflow: 'hidden', 
        alignSelf: 'center',
         width: width*0.3,
        height: height*0.04,
      },
      gradientBackground: {
        paddingVertical: 7,
        paddingHorizontal: 45,
        width: width*0.3,
        height: height*0.04,
        borderRadius: 100, 
        alignItems: 'center',
      },
      progressContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
      },
      progressFill: {
        position: "absolute",
        left: 0, 
        height: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
      },
      calculateButtonText:{
      fontSize: 16,
      fontFamily: 'Effra_Regular',
      color: theme.alwaysWhite,
      zIndex: 5,
      transform: [
        { translateY: 1 }
      ],},
        chartTitleContainer:{
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between'
    },
    chartOptions:{
    flexDirection: 'row',
    gap: 15,
    marginVertical: 'auto'
    },
    chartInfoSeparator:{
      height:20,
      width: 2,
      backgroundColor: theme.primaryBorder,
      },
        chartResultList: {
        paddingLeft: width*0.125,
      },
    ChartInfo:{
      margin: 'auto',
      width: width*.9,
      paddingTop: 5,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      },
      ChartInfoTime:{
        maxWidth: width*.25,
        textAlign: 'center',
        fontSize: height*0.018,
        fontFamily: 'Effra_Regular',
        color: theme.secondary,
        },
        resultCircle:{
          justifyContent: 'center',
          alignSelf: 'center',
          height: width * 0.95,
          width: width * 0.95,
          marginVertical: 10
        },
      
        // addchart //
        toastContainer: {
          position: "absolute",
          top: 50,
          left: width*0.05,
          right: width*0.05,
          height: width*0.17,
          backgroundColor:'#333333',
          paddingVertical: height*0.01,
          paddingHorizontal: height*0.02,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          elevation: 5, 
          shadowColor: "#000", 
          shadowOpacity: 0.3,
          shadowOffset: { width: 2, height: 2 },
          gap: 15,
          zIndex: 1000
        },
        icon: {
          width: height*0.03,
          height: height*0.03,
          fill: 'white',
          marginVertical: 'auto',
          marginHorizontal: 0
        },
        toastText: {
          color: theme.alwaysWhite,
          fontSize: height*0.018,
          lineHeight: height*0.022,
          flexShrink: 1, 
          marginVertical: 'auto',
          marginLeft: 0,
          marginRight: 'auto',
          fontFamily: 'Effra_Light'
        },
        modalContainer: {
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        },
        modalContent: {
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          flex:1,
          maxHeight: height*0.8
        },
        modalForm:{
          justifyContent: 'center',
          alignSelf: 'center',
          gap: height*0.015,
          width: width*0.9
        },
        modalSlider: {
          justifyContent: 'center',
          height: 2,
          marginTop: 20,
          marginBottom: 5,
          width: width*0.1,
          marginHorizontal: 'auto',
          backgroundColor: theme.alwaysWhite
        },
        modalTitle: {
        fontSize: 20,
        color: '#f2f2f2',
        fontFamily: 'Effra_Regular',
        paddingVertical: 15,
        marginHorizontal: 'auto'
        },
        modalText: {
        fontSize: 15,
        fontFamily: 'Effra_Regular',
        textAlign: "start",
        color: '#f2f2f2',
        paddingLeft: 10
        },
        modalInput: {
          height: height*0.045,
        paddingBottom: 3,
        paddingHorizontal: 20,
        paddingTop: 5,
        borderRadius: 20,
        borderWidth: .5,
        borderColor: theme.sheetBorder,
        backgroundColor: theme.background,
        color: theme.secondary,
        fontSize: 16,
        fontFamily: 'Effra_Regular',
        },
        modalDateTimeInput: {
        height: height*0.045,
        paddingBottom: 3,
        paddingHorizontal: 20,
        paddingTop: 5,
        borderRadius: 20,
        borderWidth: .5,
        borderColor: theme.sheetBorder,
        backgroundColor: theme.background,
        color: theme.secondary,
        fontSize: 16,
        fontFamily: 'Effra_Regular',
        textAlign: 'center'
        },
        input: {
          borderColor: theme.sheetBorder,
          color: theme.secondary,
          fontSize: height*.018,
          lineHeight: height*.02,
          fontFamily: 'Effra_Regular'
        },
        modalPickerContainer: {
        },
        modalPicker: {
        color: theme.secondary,
        fontFamily: 'Effra_Regular',
        marginVertical: 'auto',
        transform: [
          { translateY: -10 },
        
        ],
        }, 
        modalView: {
          width: width,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
        },
        modalDatePicker: {
        height: height*0.045,
        backgroundColor: theme.background,
        padding: 0,
        width: width*0.9,
        borderRadius: 20,
        borderWidth: .5,
        borderColor: theme.sheetBorder,
        fontFamily: 'Effra_Regular',
        fontSize: 14,
        margin: 'auto'
        },
        modalTitleDatePicker: {
        color: theme.secondary,
        fontSize: 14,
        fontFamily: 'Effra_Regular',
        padding: 0,
        margin: 0
        },
        modalButtonContainer: {
          borderRadius: 25, 
          overflow: 'hidden', 
          alignSelf: 'center',
           width: width*0.3,
          height: height*0.04,
        },
        modalButtonEditText: {
        fontSize: 15,
        fontFamily: 'Effra_Regular',
        color: theme.alwaysWhite,
        transform: [
          { translateY: 1 }
        ],
        },
        
        gradientBackground: {
        paddingVertical: 7,
        paddingHorizontal: 35,
        borderRadius: 100, 
        alignItems: 'center',
        width: width*0.3,
        height: height*0.04,
        },
          progressContainer: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        },
        progressFill: {
          position: "absolute",
          left: 0, 
          height: "100%",
          backgroundColor: 'rgba(0, 0, 0, 0.2)', 
        },
        modalCloseButton: {
        backgroundColor: theme.red,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 'auto',
        
        marginBottom: height*0.1,
        },
        modalCloseButtonIcon: {
        fill: theme.alwaysWhite,
        width: 12,
        height: 12,
        margin: 'auto',
        transform: [{ rotate: '45deg' }]
        },
        dropdownBox:{
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderWidth: 1,
          marginTop: 15,
          marginHorizontal: 10,
          borderColor: theme.secondary,
          backgroundColor: theme.background,
          color: theme.secondary,
          fontSize: 16,
          fontFamily: 'Effra_Regular',
        },
        dropdownList:{
          width: width*.83,
          alignSelf: 'center',
          maxHeight: height*0.2, 
          borderWidth: 1,
          borderColor: theme.secondary,
          borderRadius: 0,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        },
        inputStyles:{
          color: theme.secondary,
          fontFamily: 'Effra_Regular',
          fontSize: height*0.016,
          lineHeight: height*0.017,
          },
          dropdownTextStyles:{
            color: theme.secondary,
            fontSize: height*0.016,
            fontFamily: 'Effra_Regular',
            paddingHorizontal: 15,
            paddingVertical: 5
          },

          // glosario

          searchBarContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex:1,
            top: height*.022,
            height:height*.09,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
          },
          searchBar: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignContent: 'center',
            gap: 5,
            width: width*0.875,
            height:height*.04,
            paddingLeft: 15,
            borderWidth: 1,
            borderRadius: 50,
            marginHorizontal:'auto',
            borderColor:  theme.secondaryBorder,
          },
          searchBarIcon:{
            width: height*.02,
            height: height*.02,
            marginVertical: 'auto',
          },
          searchBarInput:{
      fontFamily: 'Effra_Regular',
      height:height*.05,
      width: width*.75,
      color: theme.secondary
          },
       
      glosarioContainer: {
        paddingTop: 25,
      },
      row: {
        marginHorizontal: 15,
        flexDirection: 'row', 
        gap: 10,
        marginVertical: 5
      },
      categoriaCirculo: {
      width: height*0.055,
      height: height*0.055,
      marginVertical: 'auto',
      marginTop: 0,
      textAlign: 'center',
      borderRadius: 100,
      },
      categoriaLetra: {
      textAlign: 'center',
      margin: 'auto',
      color: theme.alwaysWhite,
      fontSize: height*0.037,
      lineHeight:  height*0.044,
      fontFamily: 'Effra_Light',
      },
      termTitle: {
        fontSize: height*0.018,
        color: theme.primary,
        fontFamily: 'Effra_Medium',
      },
      termList:{
        gap: 15
      },
      termInfo: {
        fontSize: height*0.016,
        fontFamily: 'Effra_Regular',
        color: theme.secondary
      },
      glosarioHeader:{
        height: height*0.077,
      },
      expandedContent: {
      overflow: 'hidden',
      },
      expandedText: {
      fontSize: height*0.016,
      color: theme.background,
      },
      termDetailsContainer:{
       marginRight: width*0.12,
      },
      glosarioTerm: {
      gap: 0,
      marginVertical: 'auto',
      paddingHorizontal: 10
      },
      termDetails: {
      fontSize: height*0.016,
      fontFamily: 'Effra_Regular',
      color: theme.primary,
      lineHeight: height*0.025,
      width: width*0.745,
      marginVertical: 0,
      paddingBottom: 5,
      },
      glosarioFooter:{
        height: height*0.5,
      },
      termSeparatorBar:{
        height: height * .000325,
        backgroundColor: theme.primaryBorder,
      },


      //special chart

      specialChartBackgroundImage: {
        width, height: width*.7, 
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 12.5,
        paddingBottom: 15
      },
      arrowSpecialChartContainer:{
        backgroundColor: '#7ebcec',
        height: width*0.07,
        width: width*0.35,
        justifyContent: 'center',
        position: 'absolute',
        top: height*0.045,
        left: 0
      }, 
      arrowSpecialChartText:{
    textAlign: 'center',
    fontFamily: 'Effra_Bold',
    color: theme.alwaysWhite,
    fontSize: width*0.03,
    lineHeight: width*0.072,
    
      },   
      arrowSpecialChart:{
        backgroundColor: '#7ebcec',
        width: width*0.05,
        height: width*0.05,
        position: 'absolute',
        right: -width*0.025,
        transform: [{rotate: '45deg'}],
        borderTopRightRadius: 5
      },  
      specialTitleContainer: {
      },
      specialTitle: {
        fontFamily: 'Effra_Light',
        color: theme.alwaysWhite,
        fontSize: width*0.1,
        lineHeight: width*0.12,
      },
      specialSubtitle: {
        fontFamily: 'Effra_Regular',
        color: theme.alwaysWhite,
        fontSize: width*0.057,
        lineHeight: width*0.06,
      },
      specialDetailsContainer:{
      },  
      specialDetails:{
        fontFamily: 'Effra_Regular',
        color: theme.black,
        fontSize: width*0.045,
        lineHeight: width*0.061,
        margin: 15,
        marginTop: 25,
         marginBottom: height*0.2
       },  
       
       modalSpecialChartContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      },
      modalSpecialChartContent: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: theme.background,
        height: wHeight*.9325,
      },
      specialChartModalSlider: {
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        height: 2,
        marginTop: 20,
        marginBottom: 5,
        width: width*0.1,
        marginHorizontal: 'auto',
        backgroundColor: theme.alwaysWhite
      },

      //premium modal
      premiumModal:{
          padding: 20,
          flex: 1,
          height: '100%'
         },
         modalPremiumContainer: {
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        },
        modalSolarPremiumContent: {
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: theme.editSheet,
          height: wHeight*.7,
        },
            modalPremiumContent: {
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              backgroundColor: theme.editSheet,
              height: wHeight*.8,
            },
          modalPremiumSlider: {
            justifyContent: 'center',
            height: 2,
            marginTop: 25,
            width: width*0.12,
            marginHorizontal: 'auto',
            backgroundColor: theme.primaryBorder
          },
        modalPremiumTitle: {
          fontSize: height*0.027,
          fontFamily: 'Effra_Bold',
          color: theme.black,
        },
        modalPremiumSubtitle: {
          fontSize: height*0.0185,
          fontFamily: 'Effra_Regular',
          marginTop: 15,
          color: theme.black,
        },
        modalPremiumSubtitleBold: {
          fontFamily: 'Effra_Bold',
        },
        radioButton: {
          width: height*.025, 
          height: height*.025,
          borderRadius: 50,
          borderWidth: 1,
          backgroundColor: theme.grey,
          borderColor: theme.secondary,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5
        },
        selectedPremiumButton: {
          borderColor: '#7EBCEC',
        },
        innerCircle: {
          width: height*.012, 
          height: height*.012,
          borderRadius: 50, 
          backgroundColor: '#7EBCEC', 
        },
        pricingOptions:{
          gap: 15,
          marginVertical: 25
        },
        pricingOption:{
          flexDirection: 'row',
          width: '100%',
          gap: 10,
        },
        optionSeparator:{
        backgroundColor: theme.primaryBorder,
         height: 1
        },
        pricingTitle: {
          fontSize: height*0.02,
          fontFamily: 'Effra_Bold',
          color: theme.black,
        },
        pricingInfo: {
         gap: 3,
        },
        selectedText: {
          color:'#7EBCEC',
        },
        pricingDescription: {
          fontSize: height*0.015,
          lineHeight: height*0.02,
          fontFamily: 'Effra_Regular',
          maxWidth: '96%',
          flexWrap: 'wrap',
          color: theme.black,
        },
        pricingDescriptionBold: {
          fontFamily: 'Effra_Bold',
        },
        payButton:{
          backgroundColor: theme.black,
          width: '100%',
        },
        payButtonText:{
          color: theme.white,
          fontSize: height*0.02,
          textTransform: 'uppercase',
          margin:'auto',
          textAlign: 'center',
          fontFamily: 'Effra_Medium',
          paddingTop: 10 ,
          paddingBottom: 5 
        },


        // efemerides

        skeletonEventContainer: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          paddingLeft: 15,
          gap: 10,
          height: height*0.095,
          borderRadius: 10,
        },
        skeletonEventCircle: {
          width: height*0.055,
          height: height*0.055,
          borderRadius: 25,
          backgroundColor: "#ddd",
          marginTop: 0,
          margin: 'auto'
        },
        skeletonEventTextContainer: {
          flex: 1,
          marginBottom: 10
        },
        skeletonEventLine: {
          height: 15,
          backgroundColor: "#e6e6e6",
          borderRadius: 4,
          marginVertical: 5,
        },
        efemeridesContainer:{
          height: height,
          marginVertical:'auto',
          marginBottom: 0,
        },
        topEfemeridesSpace:{
          height: height*.08,
        },
        efemeridesCardContainer: {
          paddingTop: 15,
        },
        efemeridesCard: {
          paddingTop: 10,
          flexDirection: 'row', 
          gap: 10,
          paddingLeft: 15
        },
        categoriaEventoLetra: {
          textAlign: 'center',
          margin: 'auto',
          color: theme.alwaysWhite,
          fontSize: height*0.05,
          fontFamily: 'Astronomicon',
          lineHeight: height*0.045,
        },
        categoriaCirculo: {
          width: height*0.055,
          height: height*0.055,
        marginVertical: 'auto',
        marginTop: 0,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        },
        signoEstilo:{
          textAlign: 'center',
          margin: 'auto',
          color: theme.alwaysWhite,
          fontSize: height*0.04,
          lineHeight: height*0.04,
          fontFamily: 'Astronomicon',
        },
        retroEstilo:{
          textAlign: 'center',
          margin: 'auto',
          marginTop: height*0.007,
          marginLeft: height*0.019,
          color: theme.alwaysWhite,
          fontSize: height*0.06,
          fontFamily: 'Astronomicon',
        },
        lunaEstilo:{
          textAlign: 'center',
          color: theme.alwaysWhite,
          margin: 'auto',
          marginTop: 'auto',
          fontSize: height*0.04,
          fontFamily: 'Astronomicon',
          textAlign: 'left',
          transform: [
            { translateY: .5 }, { translateX:2 }
          ],
        },
        eventContainer:{
          borderColor: theme.primaryBorder,
          borderBottomWidth: height*.000325,
          width: width*1,
          paddingBottom: 10,
        },
        eventTitle: {
          fontSize: height * 0.018,
          color: theme.primary,
          fontFamily: 'Effra_Medium',
          maxWidth: '90%',
          flexWrap: 'wrap',
        },
        eventShareIcon: {
          fill: theme.secondaryBorder,
          width: height*0.018,
          height: height*0.018,
          margin: 'auto',
        },
        eventInfo: {
          fontSize:  height*0.019,
          fontFamily: 'Effra_Regular',
          color: theme.secondaryBorder
        },
        noEventsContainer:{
          paddingTop: height*0.05,
          textAlign: 'center',
          justifyContent: 'center',
        alignItems: 'center',
        gap: height*0.015
        },
        noEventsText: {
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        fontSize: height*0.022,
        lineHeight: height*0.035,
        color: theme.secondary,
        marginHorizontal: 60,
        marginTop: 5,
        fontFamily: 'Effra_Light',
        },
        noEventsTitle: {
        fontSize:  height*0.04,
        lineHeight: height*0.045,
        width: width*0.7,
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Effra_Light',
        color: theme.secondaryBorder
        },
        noEventsIcon:{
          width: width*0.6,
          height: width*0.6,
          margin: 'auto',
          fill: theme.secondaryBorder
        },  
        expandedContent: {
        overflow: 'hidden',
      },
      eventDetailsContainer:{
        marginTop: 10,
        marginBottom: 0,
        width: width*.765,
      },
      eventDetails: {
        fontSize: height*0.017,
        fontFamily: 'Effra_Regular',
        color: theme.primary,
        lineHeight: height*0.024,
        marginVertical: 'auto',
      },

      // errorboundary


      errorContainer:{
          flex: 1,
          alignItems: 'center',
          textAlign: 'center',
        },
        errorGradient:{
          position: 'absolute'
        },
        errorIcon:{
      position: 'absolute',
      bottom: 275,
      fill: theme.primary
        },
        UpsContainer:{
          margin: 'auto',
          marginHorizontal: 25,
          gap: 5,
          paddingTop: 60
        },
        UpsText:{
          color: theme.secondaryBorder,
          margin: 'auto',
          fontSize: 24,
          textAlign: 'center',
          fontFamily: 'Effra_Light'
        },
        UpsTextInfo:{
          color: theme.secondaryBorder,
          margin: 'auto',
          fontSize: 20,
          textAlign: 'center',
          fontFamily: 'Effra_Light',
          marginTop: 20
        },
        ErrorButton:{
          width: 170,
          borderRadius: 100,
          backgroundColor: theme.alwaysBlack,
          borderWidth: 1,
          borderColor: theme.alwaysWhite,
          margin: 'auto',
          marginTop:  20,
        },
        ErrorButtonTitle:{
          textAlign: 'center',
          fontSize: 18,
          color: theme.alwaysWhite,
          fontFamily: 'Effra_Regular',
          padding: 0,
          transform: [
            { translateY: 1.5 }
          ],
        },

        // alerts
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        alertLogOutbox: {
          backgroundColor: theme.alertModal,
          borderRadius: 12,
          width: '70%',
          paddingTop: 40,
          height: height*.475,
          alignItems: 'center',
          justifyContent: 'space-between'
        },
        alertDeleteBox: {
          backgroundColor: theme.alertModal,
          borderRadius: 12,
          width: '80%',
          alignItems: 'center',
        },
        alertDeleteMessage: {
          textAlign: 'center',
          paddingTop: 50,
          paddingBottom: 5,
          fontFamily: 'Effra_Regular',
          width: width*.6,
          fontSize: height * 0.022,
          color: theme.secondary,
        },
        logOutMessage: {
          textAlign: 'center',
          width: width*.55,
          fontFamily: 'Effra_Regular',
          color: theme.secondary,
          fontSize: height * 0.022,
          lineHeight: height * 0.032,
        },
        alertButtons: {
          flexDirection: 'row',
          width: '100%',
          marginTop: 40,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginBottom: 0
        },
        cancelButton: {
          justifyContent: 'center',
          textAlign: 'center',
          width: '50%',
          paddingTop: 15,
          backgroundColor: theme.alertButtons,
          paddingBottom: 10,
          borderBottomLeftRadius: 12,
        },
        cancelButtonPressed: {
          backgroundColor: '#e0e0e0',
          borderBottomLeftRadius: 12,
        },
        cancelText: {
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'Effra_Regular',
          fontSize: height * 0.02,
          color: theme.primary,
        },
        cancelTextPressed: {
          color: '#000',
        },
        deleteButton: {
          width: '50%',
          paddingTop: 15,
          backgroundColor: theme.alertButtons,
          paddingBottom: 10,
          borderBottomRightRadius: 12,
        },
        deleteButtonPressed: {
          backgroundColor: '#ffd6d6',
          borderBottomRightRadius: 12,
        },
        deleteText: {
          color: theme.red,
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'Effra_Regular',
          fontSize: height * 0.02,
        },
        deleteTextPressed: {
          color: '#b30000',
        },

        alertConfirmBox: {
          backgroundColor: theme.alertModal,
          borderRadius: 12,
          width: '80%',
          alignItems: 'center',
        },
        alertConfirmMessage: {
          textAlign: 'center',
          paddingTop: 40,
          fontFamily: 'Effra_Light',
          color: theme.secondary,
          width: width*.7,
          fontSize: height * 0.022,
        },






  });
};
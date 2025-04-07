'use client'
import './background.scss';
import { useState } from 'react';

export default function Background () {
        // const colorArray: string[] = ['#89A8B2', '#B3C8CF', '#E5E1DA', '#F1F0E8']
        const colorArray: string[] = ['#A5B68D', '#B7B1F2', '#FFB4A2', '#C6E7FF', '#FFE6A9', '#FFB38E', '#8967B3', '#C96868']
        // const [backgroundColor, setBackgroundColor] = useState(colorArray[Math.floor(Math.random() * colorArray.length)]);  
        const color = 'rgb(240, 240, 240)'; 
        const [backgroundPosition, setBackgroundPosition] = useState(0);  
        const color1 = colorArray[Math.floor(Math.random() * colorArray.length)];
        const color2 = colorArray[Math.floor(Math.random() * colorArray.length)];
        let background = 'linear-gradient(to bottom, ' + color1 + ' ' + backgroundPosition + '%, ' + color2 + ')';   

        // const [sphereColor1, setSphereColor1] = useState(colorArray[Math.floor(Math.random() * colorArray.length)]);       
        // const [sphereColor2, setSphereColor2] = useState(colorArray[Math.floor(Math.random() * colorArray.length)]);       
        // const [sphereColor3, setSphereColor3] = useState(colorArray[Math.floor(Math.random() * colorArray.length)]);  
        // const [sphereColor4, setSphereColor4] = useState(colorArray[Math.floor(Math.random() * colorArray.length)]);  

        setInterval(()=>{            
            setBackgroundPosition(backgroundPosition + 1);
        }, 1000)

        // setInterval(()=>{
        //     setSphereColor1(colorArray[Math.floor(Math.random() * colorArray.length)]);   
        // }, 10000); 
    
        // setInterval(()=>{
        //     setSphereColor2(colorArray[Math.floor(Math.random() * colorArray.length)]);   
        //     setBackgroundColor(colorArray[Math.floor(Math.random() * colorArray.length)]);   
        // }, 15000); 
    
        // setInterval(()=>{
        //     setSphereColor3(colorArray[Math.floor(Math.random() * colorArray.length)]);   
        // }, 20000);

        // setInterval(()=>{
        //     setSphereColor4(colorArray[Math.floor(Math.random() * colorArray.length)]);   
        // }, 17000);
        

            return (
                <div id="background-container" style={{background: color}}>
                    {/* <div style={{background: 'linear-gradient(to left, ' + color1 + ', ' + color2 + ')', boxShadow: "0px 0px 0px 0px " + color }} className="sphere"></div> */}
                    {/* <div style={{background: 'linear-gradient(to left, ' + color1 + ', ' + color2 + ')', boxShadow: "0px 0px 0px 0px " + color }} className="sphere"></div> */}
                    {/* <div style={{background: 'linear-gradient(to left, ' + color1 + ', ' + color2 + ')', boxShadow: "0px 0px 0px 0px " + color }} className="sphere"></div>    */}
                    {/* <div style={{background: 'linear-gradient(to left, ' + color1 + ', ' + color2 + ')', boxShadow: "0px 0px 0px 0px " + color }} className="sphere"></div>                                      */}
                </div>
            )
}
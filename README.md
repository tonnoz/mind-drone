# mind-drone
Flying a drone with your mind? Is it possible?
Start with [the presentation.](https://slides.com/tonnoz/mind-drone).

## What is this?
A simple [Express](https://expressjs.com/) application that allows you to interact with a Parrot AR-Drone 2.0 with your mind (through a Neurosky EEG compatibile headset). The client to interact with the drone is [Node AR Drone](https://github.com/felixge/node-ar-drone).
  
  
  
### Features:
- Takeoff or land via eyes blinking
- Use _high level attention_ to make a "fire led" animation 
- Use _high level meditation_ to make a "wave" flying evolution (a circle dance)
- Browse your current EEG levels via a customizable graph (available on http://localhost:8080/index.html)
- Fully control the drone from the keyboard
- Enable/disable/toggle features from Keyboard (EEG/DRONE)
  
  
  
## Requirements
- A computer with a Blueetooth and Wifi connection 
- A Neurosky EEG device (e.g. [Star Wars: Force trainer 2](https://www.youtube.com/watch?v=mpxlzks0Di0))
- [A Parrot AR Drone 2.0](https://www.parrot.com/us/drones/parrot-ardrone-20-elite-edition)
- A Windows/Linux/Mac machine
- Npm 3.8.6+ and Node v5.12.0+
  
  
  
## How to install
```
npm install
```
  
  
  
## How to run
0) Install [NeuroSky ThinkGear Connector for Windows/Mac](http://developer.neurosky.com/docs/doku.php?id=mdt2.5). For Linux see instructions below.
1) Bind and connect your EEG device to the Blueetooth of your machine
2) Wear the EEG helmet and turn it on
3) Plug in the battery to your AR Drone 2.0
4) Connect your machine to the Wifi of the AR Drone 2.0 (open SSID)
5) From the root of the project, launch:
```
npm start
```
6) Browse [http://localhost:8080/index.html](http://localhost:8080/index.html) to visualize your EEG live data.
7) Use Keyboard binding from terminal to control the drone


### Linux

Connecting to the Mindwave from Ubuntu or any other Linux-based OS can be done entirely from the command line using [Gort](http://gort.io) commands.
Here are the steps:

Find the address of the EEG device, by using:

    $ gort scan bluetooth

Pair/Connect to Mindwave using this command (substituting the actual address of your EEG Device):

    $ gort bluetooth connect <address>


## Safety
Be sure to use the drone in area large and high enough and check that the Keyboard commands work before enabling the mind control features.
  
  


## Licence

```
The MIT License (MIT)
Copyright (c) 2019 tonnoz
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

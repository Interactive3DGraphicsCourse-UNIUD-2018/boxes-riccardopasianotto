# Project Journal

**Progress log** 
*  First thoughts on project. Main idea: create e scene that will represent a plane flying over a forest.
Naturally each object of the scene has to be made of `BoxGeometry` instances. 
I think I'll use the starting file with lights.
First of all I need to setup the overall environment and project files to be more productive as possible.
* Environment setup completed. Moved all js from the `script` tag inside the HTML DOM into a `main.js` file inside a new `project` folder.
* First sketches drawn on paper. Now I'll start a simple implementation of the basic idea.
* Logging some progress. I've defined the main parts of the plane object. In the commit that come with this log, the scene can be seen with the boxes of different color to understand how they are positioned.
* The main skeleton of the Airplane is ready. Now I'm thinking about the details of the landing gear and front propellers.
* Propeller done. Thinking about animation.
* I will animate the propeller. So the way it is created, as an Object3D to which has been added also the blades, will allow me to rotate the propeller and transfer the rotation also to the blades themselves.
If for instance we write `propeller.rotateX(45)`, we will notice a rotation of the propeller object respect to the x axis, and with him also the blades attached.
* What about *Project Ancillotto* as code name? Sounds good ahah.
* Looking at some reference images from the *Nieuport 11*.
* Drawing sketches of the landing gear and thinking about composing boxes. There will be a bullon, a wheel, vertical axis and sustaining axis. Now to the implementation.
* Implemented the langing gear as a composition of axes, wheels and bullons.
* Want to make changes to the central wings to be more similar to the Nieuport 11.
* Implemented axes system for the central wings. Only an addition has to be made, a wind shield.
* Little changes implemented. I added a windshield and a simple rose box that represent a man in control of the airplane.
Nex step is to setup the whole colors of the airplane and position it in the world.
* Coloring done through a global variable to be more flexible.
* I need to fix all the projected shadows.
* Thinking of a random way to build clouds.
* I've animated the propeller. `this.propeller` has to be set into `Airplane` object so it can be modified and accessed publicly from the object instance of `Airplane` inside the animation method.
* Important updates! The scene is ready!
Things I've implemented:
  - There is a new cloud object. This object is composed by a random number of boxes (`var nBox = 3 + Math.floor(Math.random()*10)`) which position is randomized around a central pivot.
  - There is a new cloud group object. This object is a composition of a random number of clouds (`var nClouds = Math.random() * 50 + 3`) which are then distributed around a circonference with random range, but minimum 50, at a random angle.
  - The cloud group is animated so the user can feel the movement of the clouds and imagine the airplane flying through them.
Things I've still to do now is to create the heightmap and fix the shadows. Also, keep up with code comments.
Maybe I'll separate the objects in different files, will see.
* I've done a small iteration over the animation and a small refactoring of the code to encapsulate the instantiation of the cloud group into a function.
* I'm working on the creation of the heightmap.
* I created the heightmap. I'm not relly happy with the visual effect, I tried with images with higher resolution but drawing too many boxes impacted on the frame rate too hard. Hence I kept the original png and worked with it to generate the new ground.
* Now I think the scene and all the goals are met, now ill setup the repository to clarify what is going on with the project and write the report.
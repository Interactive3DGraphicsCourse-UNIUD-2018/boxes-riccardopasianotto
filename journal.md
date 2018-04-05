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
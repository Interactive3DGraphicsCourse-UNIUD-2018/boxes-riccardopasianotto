// Global variables
var scene, camera, renderer, controls, stats
var Colors = {
  sand: 0x8e7433,
  metal: 0xd1d1d1,
  brown: 0xaf8960,
  black: 0x2d2b29,
  sandBrown: 0xc6ab8b,
  red: 0xff0505,
  green: 0x2eef1c,
  white: 0xffffff,
  rose: 0xffaacf,
  sky: 0x1fa9e0
}

// This fucntion matches the original Start() function
function setupScene(){
  // Get the width and height of the screen
  // and use them to setup the aspect ratio
  // of the camera and the size of the renderer.
  HEIGHT = window.innerHeight
  WIDTH = window.innerWidth
  
  // Create the scene instance
  scene = new THREE.Scene()

  // Camera & properties setup
  aspectRatio = WIDTH/HEIGHT
  fieldOfView = 75
  nearPlane   = 0.1
  farPlane    = 1000
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  )
  
  // Renderer setup
  renderer = new THREE.WebGLRenderer( {antialias: true} )
  renderer.setSize( WIDTH, HEIGHT )
  renderer.setClearColor( Colors.sky )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.shadowMap.enabled = true 
  document.body.appendChild( renderer.domElement )

  // Basic lighting
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 )
  hemiLight.color.setHSL( 0.6, 1, 0.6 )
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 )
  hemiLight.position.set( 0, 500, 0 )
  scene.add( hemiLight )

  dirLight = new THREE.DirectionalLight( 0xffffff, 1 )
  dirLight.color.setHSL( 0.1, 1, 0.95 )
  dirLight.position.set( -1, 1.75, 1 )
  dirLight.position.multiplyScalar( 50 )
  scene.add( dirLight )
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024

  // Stats panel to monitor frame rate
  stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.top = '0px'
  document.body.appendChild( stats.domElement )

  // Orbit controls to move camera
  controls = new THREE.OrbitControls( camera )
  // Camera positioning
  camera.position.set(50,50,20)
  controls.update()
  controls.addEventListener( 'change', Render )
  
}

// Airplane Object
var AirPlane = function() {
  
  // Use of Object3D to compose the airplane of multiple
  // geometries and meshes to let manipulate it later as a whole
  this.mesh = new THREE.Object3D();

  // Central area
  // This the central box of the plane, stretched on the x axis
  var centralAreaGeometry = new THREE.BoxGeometry(120,45,45)
  var centralAreaMaterial = new THREE.MeshPhongMaterial({
    color: Colors.sand
  })
  var centralArea = new THREE.Mesh(centralAreaGeometry, centralAreaMaterial)
  // Mesh has to cast and receive shadows from other surrounding meshes
  this.mesh.add(centralArea)
  
  // Engine
  // This is the front box where the hypotetical engine usually were on old planes
  // indeed this box will represent this engine
  var engineGeometry = new THREE.BoxGeometry(20,50,50)
  var engineMaterial = new THREE.MeshPhongMaterial({
    color: Colors.metal
  })
  var engine = new THREE.Mesh(engineGeometry, engineMaterial)
  // Translate engine on the x axis to bring it in fornt of central area
  engine.position.x = centralAreaGeometry.parameters.width / 2 + engineGeometry.parameters.width / 2
  this.mesh.add(engine)

  // Back of the plane

  // Back Area
  var backAreaGeometry = new THREE.BoxGeometry(40,20,35)
  var backAreaMaterial = new THREE.MeshPhongMaterial({
    color: Colors.white
  })
  var backArea = new THREE.Mesh(backAreaGeometry, backAreaMaterial)
  backArea.position.x = - centralAreaGeometry.parameters.width / 2 - backAreaGeometry.parameters.width / 2
  // Half the height of the central area, minus half of the height of this box
  backArea.position.y = centralAreaGeometry.parameters.height / 2 - backAreaGeometry.parameters.height / 2
  this.mesh.add(backArea)

  // Back Wing
  var backWingGeometry = new THREE.BoxGeometry(35,5,135)
  var backWingMaterial = new THREE.MeshPhongMaterial({
    color: Colors.red
  })
  var backWing = new THREE.Mesh(backWingGeometry, backWingMaterial)
  // Back Wing positioning
  backWing.position.set(
    -centralAreaGeometry.parameters.width / 2 -backAreaGeometry.parameters.width,
    centralAreaGeometry.parameters.height / 2 - 5,
    0
  )
  this.mesh.add(backWing)

  // Vertical Back Flap
  var verticalBackFlapGeometry = new THREE.BoxGeometry(25,35,5)
  var verticalBackFlapMaterial = new THREE.MeshPhongMaterial({
    color: Colors.green
  })
  var verticalBackFlap = new THREE.Mesh(verticalBackFlapGeometry, verticalBackFlapMaterial)
  // Vertical Back Wing positioning
  verticalBackFlap.position.set(
    -centralAreaGeometry.parameters.width / 2 - backAreaGeometry.parameters.width,
    centralAreaGeometry.parameters.height / 2 + verticalBackFlapGeometry.parameters.height / 2 - 5,
    0
  )
  this.mesh.add(verticalBackFlap)

  // Central Side Wings
  var centralSideWingGeometry = new THREE.BoxGeometry(40,5,220)
  var centralSideWingMaterial = new THREE.MeshPhongMaterial({
    color: Colors.sand
  })

  // Two mesh with same geometry and material, in fact these two are the same
  // but will be positioned differently
  var centralSideWingTop = new THREE.Mesh(centralSideWingGeometry, centralSideWingMaterial)
  var centralSideWingBottom = new THREE.Mesh(centralSideWingGeometry, centralSideWingMaterial)

  // Side Wings Positioning
  centralSideWingTop.position.set(
    centralAreaGeometry.parameters.width / 2 - centralSideWingGeometry.parameters.width / 2,
    45,
    0)
  centralSideWingBottom.position.set(
    centralAreaGeometry.parameters.width / 2 - centralSideWingGeometry.parameters.width / 2,
    -centralAreaGeometry.parameters.height / 2 + centralSideWingGeometry.parameters.height / 2 + 0.5, // 0.5 to remove z-fighting
    0)

  this.mesh.add(centralSideWingTop);
  this.mesh.add(centralSideWingBottom);

  // Central wings axes system
  var wingVerticalAxesGeometry = new THREE.BoxGeometry(3,centralSideWingTop.position.y - centralSideWingBottom.position.y,3)
  var wingVerticalAxesMaterial = new THREE.MeshPhongMaterial({
     color: Colors.metal
   })

  // Axes definition
  var wingAxisDx = new THREE.Mesh(wingVerticalAxesGeometry, wingVerticalAxesMaterial)
  var wingAxisSx = new THREE.Mesh(wingVerticalAxesGeometry, wingVerticalAxesMaterial)
  // Remember to add shadow casting ecc..
  centralSideWingBottom.add(wingAxisDx, wingAxisSx)
  wingAxisDx.position.z = centralSideWingGeometry.parameters.depth / 3
  wingAxisDx.position.y = wingVerticalAxesGeometry.parameters.height / 2
  wingAxisSx.position.z = -centralSideWingGeometry.parameters.depth / 3
  wingAxisSx.position.y = wingVerticalAxesGeometry.parameters.height / 2

  // Sustaining axes
  var wingSustainingAxisDx = wingAxisDx.clone()
  var wingSustainingAxisSx = wingAxisSx.clone()
  centralSideWingBottom.add(wingSustainingAxisDx, wingSustainingAxisSx)
  wingSustainingAxisDx.position.z = centralSideWingGeometry.parameters.depth / 4.5
  wingSustainingAxisDx.scale.set(1, 1.2, 1)
  wingSustainingAxisDx.position.y += 5
  wingSustainingAxisDx.rotateX(0.75)
  wingSustainingAxisSx.position.z = -centralSideWingGeometry.parameters.depth / 4.5
  wingSustainingAxisSx.scale.set(1, 1.2, 1)
  wingSustainingAxisSx.position.y += 5
  wingSustainingAxisSx.rotateX(-0.75)

  // Front Propeller
  var propellerGeometry = new THREE.BoxGeometry(12,12,12)
  var propellerMaterial = new THREE.MeshPhongMaterial({
    color: Colors.black
  })
  this.propeller = new THREE.Mesh(propellerGeometry, propellerMaterial)
  this.propeller.position.x =  centralAreaGeometry.parameters.width/2 +
                          engineGeometry.parameters.width +
                          propellerGeometry.parameters.width/2
  this.mesh.add(this.propeller)

  // Blades
  var bladeGeometry = new THREE.BoxGeometry(1, 100, 10)
  var bladeMaterial = new THREE.MeshPhongMaterial({
    color: Colors.brown
  })
  var verticalBlade = new THREE.Mesh(bladeGeometry, bladeMaterial)
  var horizontalBlade = new THREE.Mesh(bladeGeometry, bladeMaterial)
  // Rotation of the horizontalBlade
  horizontalBlade.rotateX(Math.PI/2)
  this.propeller.add(verticalBlade, horizontalBlade)

  // Landing Gear

  // I will use the bullon as starting point and compose a wheel from it
  // Bullon
  var bullonGeometry = new THREE.BoxGeometry(7, 7, 8)
  var bullonMaterial = new THREE.MeshPhongMaterial({
    color: Colors.metal
  })

  // Dx Bullon
  var bullonDx = new THREE.Mesh(bullonGeometry, bullonMaterial)

  // Sx Bullon
  var bullonSx = new THREE.Mesh(bullonGeometry, bullonMaterial)
  
  // Wheel
  var wheelGeometry = new THREE.BoxGeometry(20, 20, 5)
  var wheelMaterial = new THREE.MeshPhongMaterial({
    color: Colors.black
  })

  // Dx Wheel
  var wheelDx = new THREE.Mesh(wheelGeometry, wheelMaterial)
  bullonDx.add(wheelDx)

  // Sx Wheel
  var wheelSx = new THREE.Mesh(wheelGeometry, wheelMaterial)
  bullonSx.add(wheelSx)

  // Axes area of the landing gear
  // Central Axis
  var centralAxisGeometry = new THREE.BoxGeometry(3, 3, 50)
  var centralAxisMaterial = new THREE.MeshPhongMaterial({
    color: Colors.metal
  })
  var centralAxis = new THREE.Mesh(centralAxisGeometry, centralAxisMaterial)
  // Central axis position
  centralAxis.position.x = centralAreaGeometry.parameters.width / 2 - 3
  centralAxis.position.y = -50
  this.mesh.add(centralAxis)

  // Vertical Axes
  var verticalAxisGeometry = new THREE.BoxGeometry(3, 40, 3)
  var verticalAxisMaterial = new THREE.MeshPhongMaterial({
    color: Colors.metal
  })
  var verticalAxisDx = new THREE.Mesh(verticalAxisGeometry, verticalAxisMaterial)
  var verticalAxisSx = new THREE.Mesh(verticalAxisGeometry, verticalAxisMaterial)

  // Composition
  centralAxis.add(bullonDx, bullonSx)
  bullonSx.position.z = -25
  bullonDx.position.z = 25
  centralAxis.add(verticalAxisDx, verticalAxisSx)
  verticalAxisDx.position.y = 20
  verticalAxisDx.position.z = 15
  verticalAxisDx.rotateX(-0.25)
  verticalAxisSx.position.y = 20
  verticalAxisSx.position.z = -15
  verticalAxisSx.rotateX(0.25)

  // Axes cloned
  var sustainingAxisDx = verticalAxisDx.clone()
  var sustainingAxisSx = verticalAxisSx.clone()
  centralAxis.add(sustainingAxisDx, sustainingAxisSx)
  // Set sustaining axes position and dimensions
  sustainingAxisDx.scale.set(0.80,1.3,0.80)
  sustainingAxisDx.rotateZ(0.75)
  sustainingAxisDx.position.x = -18
  sustainingAxisDx.position.y = 18
  sustainingAxisSx.scale.set(0.80,1.3,0.80)
  sustainingAxisSx.rotateZ(0.75)
  sustainingAxisSx.position.x = -18
  sustainingAxisSx.position.y = 18


  // Simple windshield
  var windshieldGeometry = new THREE.BoxGeometry(3,10,30)
  var windshieldMaterial = new THREE.MeshPhongMaterial({
    color: Colors.white,
    transparent:true, 
    opacity:.5
  })
  var windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial)
  windshield.position.set(
    centralAreaGeometry.parameters.width/4,
    centralAreaGeometry.parameters.height/2 + windshieldGeometry.parameters.height/2,
    0)
  this.mesh.add(windshield)

  // Simple man head
  var manGeometry = new THREE.BoxGeometry(12,12,12)
  var manMaterial = new THREE.MeshPhongMaterial({
    color: Colors.rose
  })

  // The head of the man that is controlling the airplane
  var man = new THREE.Mesh(manGeometry, manMaterial)
  man.position.set(
    centralAreaGeometry.parameters.width/4 - 15,
    centralAreaGeometry.parameters.height/2 + manGeometry.parameters.height/2,
    0)
  this.mesh.add(man)


}

Cloud = function(){

  this.mesh = new THREE.Object3D()

  var cloudGeometry = new THREE.BoxGeometry(10,10,10)
  var cloudMaterial = new THREE.MeshPhongMaterial({
    color: Colors.white,
    transparent: true,
    opacity: 0.9
  })

  var cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)

  var nBox = 3 + Math.floor(Math.random()*10) // The cloud is composed by at least 3 small boxes

  for(let i = 0; i < nBox; i++) {
    var cloudBox = new THREE.Mesh(cloudGeometry, cloudMaterial)
    cloud.add(cloudBox)
    // Randomize cloudBox
    // Position the small boxes around the central box
    cloudBox.position.set(
      Math.random()*10 * (Math.floor(Math.random()*2) == 1 ? 1 : -1 ),
      Math.random()*7 * (Math.floor(Math.random()*2) == 1 ? 1 : -1 ),
      Math.random()*10 * (Math.floor(Math.random()*2) == 1 ? 1 : -1 )
    )
    // Rotate the box randomly around the three axes
    cloudBox.rotateX(THREE.Math.degToRad(Math.random()*180))
    cloudBox.rotateY(THREE.Math.degToRad(Math.random()*180))
    cloudBox.rotateZ(THREE.Math.degToRad(Math.random()*180))
    var scalingFactor = Math.random()*.5 + .5 // Scale randomly
    cloudBox.scale.set(scalingFactor, scalingFactor, scalingFactor)
  }

  this.mesh.add(cloud)

}

CloudGroup = function(){
  this.mesh = new THREE.Object3D()

  var nClouds = Math.random() * 50 + 3 // Number of clouds, at last 3

  for(let i = 0; i < nClouds; i++) {
    var randomCloud = new Cloud()
    this.mesh.add(randomCloud.mesh)

    // This chunk of code generate a random angle
    // Then place the box in the circonference with variable range, but at least of 50 to overcome overlapping with the plane
    // and create an area around it
    var angle = Math.random() * Math.PI * 2
    randomCloud.mesh.position.set(
      Math.cos(angle) * (Math.random()*150 + 50),
      Math.random()*20 * (Math.floor(Math.random()*2) == 1 ? 1 : -1 ),
      Math.sin(angle) * (Math.random()*150 + 50)
    )
  }

}

// Heightmap 3d object
Heightmap = function(){
  this.mesh = new THREE.Object3D()

  // First load data of the heightmap
  img = new Image()
  img.src = '../textures/heightmap2.png'
  img.onload = (e) => {
    var data = getHeightData(img)
  
    // Boxes drawing
    var simpleBoxGeompetry = new THREE.BoxGeometry(1,1,1)
    // Different materials for different levels of the ground
    var blueMaterial = new THREE.MeshBasicMaterial({
      color: Colors.sky
    })
    var brownMaterial = new THREE.MeshBasicMaterial({
      color: Colors.brown
    })
    var grayMaterial = new THREE.MeshBasicMaterial({
      color: Colors.metal
    }) 
    var greenMaterial = new THREE.MeshBasicMaterial({
      color: Colors.green
    }) 

    var X = 0
    var Z = 0
    var box
    for (let i = 0; i < data.length; i++) {
      // Every 60 data inputs increment Z and reset X to 0
      if (i % 60 == 0) {
        Z += 1
        X = 0
      }
      // Create the box with the right material depending on the height
      if(data[i] < 50){
        box = new THREE.Mesh(simpleBoxGeompetry, blueMaterial)
      } else if (data[i] < 130) {
        box = new THREE.Mesh(simpleBoxGeompetry, greenMaterial)
      } else if (data[i] < 180) {
        box = new THREE.Mesh(simpleBoxGeompetry, brownMaterial)
      } else {
        box = new THREE.Mesh(simpleBoxGeompetry, grayMaterial)
      }

      this.mesh.add(box)
      box.position.set(X,1,Z)  // Set position of the box
      box.scale.set(1, data[i] * .03, 1) // Scale Y about an amount related to the value in data[i]

      X += 1 // Increment X position of the next box to draw
    }
  }

}

function getHeightData(img,scale) {
  
  if (scale == undefined) scale=1;

     var canvas = document.createElement( 'canvas' );
     canvas.width = img.width;
     canvas.height = img.height;
     var context = canvas.getContext( '2d' );

     var size = img.width * img.height;
   console.log(size);
     var data = new Float32Array( size );

     context.drawImage(img,0,0);

     for ( var i = 0; i < size; i ++ ) {
         data[i] = 0
     }

     var imgd = context.getImageData(0, 0, img.width, img.height);
     var pix = imgd.data;

     var j=0;
     for (var i = 0; i<pix.length; i +=4) {
         var all = pix[i]+pix[i+1]+pix[i+2];  // all is in range 0 - 255*3
         data[j++] = scale*all/3;   
     }
  
     return data;
 }

function createPlane(){ 
  // Create new AirPlane
  airplane = new AirPlane()
  // Scale airplane
  airplane.mesh.scale.set(.15,.15,.15);
  // Set its position
  airplane.mesh.position.set(0,10,0)
  // Take airplane object mesh and add it to the scene
  scene.add(airplane.mesh);
}

function updatePlane() {
  airplane.propeller.rotation.x += 0.3;
  airplane.mesh.rotateX(Math.random()*.0025 * (Math.floor(Math.random()*2) == 1 ? 1 : -1 ))
  airplane.mesh.rotateZ(Math.random()*.0015 * (Math.floor(Math.random()*2) == 1 ? 1 : -1 ))
}

function updateClouds() {
  clouds.mesh.position.x -= 0.04
}

function createClouds() {
  clouds = new CloudGroup()
  clouds.mesh.position.set(30,20,0)
  scene.add(clouds.mesh) 
}

function createHeightmap(){
  heightmap = new Heightmap()
  heightmap.mesh.position.set(-30*7,-30,-30*7)
  heightmap.mesh.scale.set(7,1,7)
  scene.add(heightmap.mesh)
}

function Update() {
  updatePlane()
  updateClouds()
  Render()
  stats.update()
  requestAnimationFrame(Update)
}

function Render(){
  renderer.render(scene, camera)
}

function init (event){
  setupScene()
  createPlane()
  createClouds()
  createHeightmap()
  // Enter the animation loop
  Update()
}

// Init the scene as soon the whole page has loaded
window.addEventListener('load', init, false)
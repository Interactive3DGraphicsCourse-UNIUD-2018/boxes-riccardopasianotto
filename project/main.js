// Global variables
var scene, camera, renderer, controls, stats

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
  // Camera positioning
  camera.position.set(0,2,80)
  camera.lookAt( new THREE.Vector3(0,2,0))
  
  // Renderer setup
  renderer = new THREE.WebGLRenderer( {antialias: true} )
  renderer.setSize( WIDTH, HEIGHT )
  renderer.setClearColor( 0xf0f0f0 )
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

  // Ground
  var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 )
  var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } )
  groundMat.color.setHSL( 0.095, 1, 0.75 )
  var ground = new THREE.Mesh( groundGeo, groundMat )
  ground.position.y = -0.5
  ground.rotation.x = -Math.PI/2
  //scene.add( ground )
  ground.receiveShadow = true

  // Stats panel to monitor frame rate
  stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.top = '0px'
  document.body.appendChild( stats.domElement )

  // Orbit controls to move camera
  controls = new THREE.OrbitControls( camera )
  controls.addEventListener( 'change', Render )
  
}

function Update() {
  requestAnimationFrame(Update)
  Render()
}

function Render(){
  renderer.render(scene, camera)
}

// Airplane Object
var AirPlane = function() {
  
  // Use of Object3D to compose the airplane of multiple
  // geometries and meshes to let manipulate it later as a whole
  this.mesh = new THREE.Object3D();

  // Central area
  // This the central box of the plane, stretched on the x axis
  var centralAreaGeometry = new THREE.BoxGeometry(80,45,45)
  var centralAreaMaterial = new THREE.MeshPhongMaterial({
    color: 0xfff000
  })
  var centralArea = new THREE.Mesh(centralAreaGeometry, centralAreaMaterial)
  // Mesh has to cast and receive shadows from other surrounding meshes
  centralArea.castShadow = true
  centralArea.receiveShadow = true
  this.mesh.add(centralArea)
  
  // Engine
  // This is the front box where the hypotetical engine usually were on old planes
  // indeed this box will represent this engine
  var engineGeometry = new THREE.BoxGeometry(20,50,50)
  var engineMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff
  })
  var engine = new THREE.Mesh(engineGeometry, engineMaterial)
  // Translate engine on the x axis to bring it in fornt of central area
  engine.position.x = centralAreaGeometry.parameters.width / 2 + engineGeometry.parameters.width / 2
  engine.castShadow = true
  engine.receiveShadow = true
  this.mesh.add(engine)

  // Back of the plane

  // Back Area
  var backAreaGeometry = new THREE.BoxGeometry(35,30,45)
  var backAreaMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000
  })
  var backArea = new THREE.Mesh(backAreaGeometry, backAreaMaterial)
  backArea.position.x = - centralAreaGeometry.parameters.width / 2 - backAreaGeometry.parameters.width / 2
  // Half the height of the central area, minus half of the height of this box
  backArea.position.y = centralAreaGeometry.parameters.height / 2 - backAreaGeometry.parameters.height / 2
  backArea.castShadow = true
  backArea.receiveShadow = true
  this.mesh.add(backArea)

  // Back Wing
  var backWingGeometry = new THREE.BoxGeometry(35,5,135)
  var backWingMaterial = new THREE.MeshPhongMaterial({
    color: 0x00f000
  })
  var backWing = new THREE.Mesh(backWingGeometry, backWingMaterial)
  // Back Wing positioning
  backWing.position.set(
    -centralAreaGeometry.parameters.width / 2 -backAreaGeometry.parameters.width,
    centralAreaGeometry.parameters.height / 2 - 5,
    0
  )
  backWing.castShadow = true
  backWing.receiveShadow = true
  this.mesh.add(backWing)

  // Vertical Back Flap
  var verticalBackFlapGeometry = new THREE.BoxGeometry(25,35,5)
  var verticalBackFlapMaterial = new THREE.MeshPhongMaterial({
    color: 0x00f000
  })
  var verticalBackFlap = new THREE.Mesh(verticalBackFlapGeometry, verticalBackFlapMaterial)
  // Vertical Back Wing positioning
  verticalBackFlap.position.set(
    -centralAreaGeometry.parameters.width / 2 - backAreaGeometry.parameters.width,
    centralAreaGeometry.parameters.height / 2 + verticalBackFlapGeometry.parameters.height / 2 - 5,
    0
  )
  verticalBackFlap.castShadow = true
  verticalBackFlap.receiveShadow = true
  this.mesh.add(verticalBackFlap)

  // Central Side Wings
  var centralSideWingGeometry = new THREE.BoxGeometry(40,5,200)
  var centralSideWingMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff
  })

  // Two mesh with same geometry and material, in fact these two are the same
  // but will be positioned differently
  var centralSideWingTop = new THREE.Mesh(centralSideWingGeometry, centralSideWingMaterial)
  var centralSideWingBottom = new THREE.Mesh(centralSideWingGeometry, centralSideWingMaterial)
  centralSideWingTop.castShadow = true
  centralSideWingTop.receiveShadow = true
  centralSideWingBottom.castShadow = true
  centralSideWingBottom.receiveShadow = true

  // Side Wings Positioning
  centralSideWingTop.position.set(
    centralAreaGeometry.parameters.width / 2 - centralSideWingGeometry.parameters.width / 2,
    15,
    0)
  centralSideWingBottom.position.set(
    centralAreaGeometry.parameters.width / 2 - centralSideWingGeometry.parameters.width / 2,
    -3,
    0)

  this.mesh.add(centralSideWingTop);
  this.mesh.add(centralSideWingBottom);

  // Front Propeller
  var propellerGeometry = new THREE.BoxGeometry(12,12,12)
  var propellerMaterial = new THREE.MeshPhongMaterial({
    color: 0xfff000
  })
  var propeller = new THREE.Mesh(propellerGeometry, propellerMaterial)
  propeller.castShadow = true
  propeller.receiveShadow = true
  propeller.position.x =  centralAreaGeometry.parameters.width/2 +
                          engineGeometry.parameters.width +
                          propellerGeometry.parameters.width/2
  this.mesh.add(propeller)

  // Blades
  var bladeGeometry = new THREE.BoxGeometry(1, 100, 10)
  var bladeMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000
  })
  var verticalBlade = new THREE.Mesh(bladeGeometry, bladeMaterial)
  var horizontalBlade = new THREE.Mesh(bladeGeometry, bladeMaterial)
  // Rotation of the horizontalBlade
  horizontalBlade.rotateX(Math.PI/2)
  verticalBlade.castShadow = true
  verticalBlade.receiveShadow = true
  horizontalBlade.castShadow = true
  horizontalBlade.receiveShadow = true
  propeller.add(verticalBlade, horizontalBlade)

}

function createPlane(){ 
  // Create new AirPlane
  airplane = new AirPlane()
  // Set its position
  airplane.mesh.position.set(0,0,0)
  // Take airplane object mesh and add it to the scene
  scene.add(airplane.mesh);
}

function init (event){
  setupScene()
  createPlane()
  
  // Enter the animation loop
  Update()
}

// Init the scene as soon the whole page has loaded
window.addEventListener('load', init, false)
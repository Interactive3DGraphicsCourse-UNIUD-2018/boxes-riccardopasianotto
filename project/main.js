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
  camera.position.set(2,2,2)
  camera.lookAt( new THREE.Vector3(0,0,0))
  
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
  scene.add( ground )
  ground.receiveShadow = true

  // Stats panel to monitor frame rate
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );

  // Orbit controls to move camera
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', Render );
  
}

function Update() {
  requestAnimationFrame(Update)
  Render()
}

function Render(){
  renderer.render(scene, camera)
}

function init (event){
  setupScene()
  
  // Enter the animation loop
  Update()
}

// Init the scene as soon the whole page has loaded
window.addEventListener('load', init, false)
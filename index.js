const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // C for Context it allows us to draw on Canvas
const scoreEl = document.querySelector('#score')
const startbtn = document.querySelector('.button')
const startGui = document.querySelector('.container')
const result = document.querySelector('#result')
const p = document.querySelector('p')

canvas.width = innerWidth
canvas.height = innerHeight
const goodColor = 'white'

// Creating Player

class Player {
  constructor(x, y, radius, color){
    this.x = x
    this.y = y

    this.radius = radius
    this.color = color
  }

  draw(){
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}

// Creating Projectiles

class Projectile{
    constructor(x, y, radius, color, velocity){

        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x += this.velocity.x*7
        this.y += this.velocity.y*7
    }
}

// Creating Enemy

class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x -= this.velocity.x
        this.y -= this.velocity.y
    }
}

const friction = 0.99
class Particles{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alfa = 1
    }
    
    draw(){
        c.save()
        c.globalAlpha = Math.max(this.alfa, 0)
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x -= this.velocity.x
        this.y -= this.velocity.y
        this.alfa -= 0.01
    }
}

const x = canvas.width/2 
const y = canvas.height/2 
let score = 0

let player = new Player(x, y, 20, goodColor)
let projectiles = [] // Multiple Projectiles
let enemies = [] // Multiple enemies
let particles = []

function init(){
    score = 0
    scoreEl.innerHTML = 0
     player = new Player(x, y, 20, goodColor)
     projectiles = [] // Multiple Projectiles
     enemies = [] // Multiple enemies
     particles = []
}

// Spawing Enemies

function spawnEnemies(){
    setInterval(() => {
    const radius = Math.random()*20 + 10

    const entries = [[0-radius, Math.random()*canvas.height], [canvas.width+radius, Math.random()*canvas.height], [Math.random()*canvas.width, 0-radius], [Math.random()*canvas.width, canvas.height+radius]]
    

    const entry = entries[Math.round(Math.random()*3)]
    const x = entry[0]
    const y = entry[1]
    const colorno = Math.random()*360
    const color = `hsl(${colorno}, 50%, 50%)`
    const angle = Math.atan2(y-canvas.height/2, x-canvas.width/2)
    const velocity = {
        x: Math.cos(angle)*30/radius, y: Math.sin(angle)*30/radius
    }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

// Animate Function is an Infinite While Loop

let animationId

function animate(){
    animationId = requestAnimationFrame(animate) // Infinite While loop
    
    c.fillStyle = 'rgba(0, 0, 0, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height) // Clears canvas
    player.draw() // Draw Player again becuse it was cleared as well

    particles.forEach((particle, index) => {
        if(particle.alfa <= 0){
            particles.splice(index, 1)
        }
        particle.update()
    })

    projectiles.forEach((projectile, pindex) => {
        projectile.update() // Shooting each and every projectile
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height){
             setTimeout(() => {
                projectiles.splice(pindex, 1)
             }, 0)
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update() // Shooting each and every projectile
         dis = Math.hypot(player.x - enemy.x, player.y - enemy.y)
         if(dis < enemy.radius + player.radius){
            projectiles.forEach(projectile => projectiles.splice(projectile, 1))
            cancelAnimationFrame(animationId)
            result.innerHTML = score
            p.innerHTML = 'Send me a ScreenShot :D'
            startGui.style.display = 'flex'

          }
        var dis
        projectiles.forEach((projectile, pindex) => {
         dis = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

         if(dis < enemy.radius + projectile.radius){
            
            for (let i = 0; i < enemy.radius*2; i++){
                particles.push(new Particles(projectile.x, projectile.y, Math.random()*2, enemy.color, {
                    x: (Math.random() - 0.5)* (Math.random()*6),
                    y: (Math.random() - 0.5)* (Math.random()*6) 
                }))
            }
            if(enemy.radius < 20){
                score += 25
                scoreEl.innerHTML = score
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(pindex, 1)
                }, 0)
            }
            else{
                gsap.to(enemy, {
                    radius: enemy.radius - 10
                })
                score += 10
                scoreEl.innerHTML = score
                projectiles.splice(pindex, 1)
            }
        }
    })
    })

    

    
}

addEventListener('click', (event)=> {
    const angle = Math.atan2(event.clientY - canvas.height/2, event.clientX - canvas.width/2)

    const velocity = {
        x: Math.cos(angle) , y: Math.sin(angle)
    }
    projectiles.push(new Projectile (canvas.width/2, canvas.height/2, 5, goodColor, velocity ))

})

startbtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    startGui.style.display = 'none'
})
/* ============================================
   PARTICLE ANIMATION SYSTEM
   ============================================ */

class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        // Set canvas size
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Options
        this.particleCount = options.particleCount || 50;
        this.particleColor = options.particleColor || 'rgba(255, 255, 255, 0.5)';
        this.particleSize = options.particleSize || 2;
        this.particleSpeed = options.particleSpeed || 0.5;
        this.connectionDistance = options.connectionDistance || 100;
        this.connectionColor = options.connectionColor || 'rgba(255, 255, 255, 0.1)';

        this.init();
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.particleSpeed,
                vy: (Math.random() - 0.5) * this.particleSpeed,
                size: this.particleSize + Math.random() * this.particleSize
            });
        }
    }

    update() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
        });
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'transparent';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.drawConnections();

        // Draw particles
        this.ctx.fillStyle = this.particleColor;
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawConnections() {
        this.ctx.strokeStyle = this.connectionColor;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    addParticle(x, y) {
        this.particles.push({
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.particleSpeed,
            vy: (Math.random() - 0.5) * this.particleSpeed,
            size: this.particleSize + Math.random() * this.particleSize
        });
    }

    removeParticle() {
        if (this.particles.length > 0) {
            this.particles.pop();
        }
    }

    clear() {
        this.particles = [];
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles');
    
    if (particlesContainer) {
        new ParticleSystem('particles', {
            particleCount: 50,
            particleColor: 'rgba(255, 255, 255, 0.6)',
            particleSize: 2,
            particleSpeed: 1,
            connectionDistance: 120,
            connectionColor: 'rgba(255, 255, 255, 0.2)'
        });
    }
});

// Export ParticleSystem class for global use
window.ParticleSystem = ParticleSystem;
// Smooth scroll for "Get Started" button
document.querySelector(".get-started").addEventListener("click", e => {
    e.preventDefault();
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
});


       // Store comet division position
        let cometDivision = null;
        let divisionBounds = null;
        
        // Get comet division bounds
        function getDivisionBounds() {
            cometDivision = document.querySelector('.comet-background');
            const rect = cometDivision.getBoundingClientRect();
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            divisionBounds = {
                top: rect.top + scrollY,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                bottom: rect.bottom + scrollY,
                right: rect.right,
                scrollY: scrollY
            };
            
            return divisionBounds;
        }
        
        // Create PERSISTENT stars - within comet division only
        function createStars() {
            const starsContainer = document.getElementById('stars-container');
            const bounds = getDivisionBounds();
            const starCount = 100; // Reduced for division only
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Position stars within comet division
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = Math.random() * 1.5 + 0.4;
                
                star.style.left = x + '%';
                star.style.top = y + '%';
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                
                // Random animation
                star.style.animationDelay = Math.random() * 8 + 's';
                star.style.animationDuration = (5 + Math.random() * 6) + 's';
                
                starsContainer.appendChild(star);
            }
        }
        
        // Create a single comet within comet division only
        function createComet() {
            const cometContainer = document.getElementById('comet-container');
            const bounds = getDivisionBounds();
            
            const comet = document.createElement('div');
            comet.className = 'comet';
            
            // Start from a random edge of the division
            const startSide = Math.floor(Math.random() * 4);
            let startX, startY;
            
            // Convert to percentage within division
            switch(startSide) {
                case 0: // Top edge
                    startX = Math.random() * 100;
                    startY = -2; // Just above
                    break;
                case 1: // Right edge
                    startX = 102; // Just right
                    startY = Math.random() * 100;
                    break;
                case 2: // Bottom edge
                    startX = Math.random() * 100;
                    startY = 102; // Just below
                    break;
                case 3: // Left edge
                    startX = -2; // Just left
                    startY = Math.random() * 100;
                    break;
            }
            
            comet.style.left = startX + '%';
            comet.style.top = startY + '%';
            
            // Color variations
            const colors = [
                'rgba(255, 255, 255, 0.95)',
                'rgba(135, 206, 235, 0.9)',
                'rgba(173, 216, 230, 0.9)',
                'rgba(224, 255, 255, 0.9)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            comet.style.backgroundColor = color;
            comet.style.boxShadow = `0 0 15px 4px ${color}`;
            
            cometContainer.appendChild(comet);
            
            // Calculate end point (opposite side)
            let endX, endY;
            
            switch(startSide) {
                case 0: // From top to bottom
                    endX = Math.random() * 100;
                    endY = 102; // Just below
                    break;
                case 1: // From right to left
                    endX = -2; // Just left
                    endY = Math.random() * 100;
                    break;
                case 2: // From bottom to top
                    endX = Math.random() * 100;
                    endY = -2; // Just above
                    break;
                case 3: // From left to right
                    endX = 102; // Just right
                    endY = Math.random() * 100;
                    break;
            }
            
            // Calculate angle and distance
            const angle = Math.atan2(endY - startY, endX - startX);
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const speed = 0.15; // Slower speed for percentage movement
            
            // Create trail
            const trail = document.createElement('div');
            trail.className = 'trail';
            trail.style.left = startX + '%';
            trail.style.top = startY + '%';
            trail.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
            trail.style.background = `linear-gradient(90deg, transparent, ${color}66, transparent)`;
            
            cometContainer.appendChild(trail);
            
            return {
                element: comet,
                trail: trail,
                x: startX,
                y: startY,
                endX: endX,
                endY: endY,
                angle: angle,
                distance: distance,
                speed: speed,
                progress: 0,
                color: color,
                isVisible: false,
                container: cometContainer
            };
        }
        
        // Fade in the comet
        function fadeInComet(comet) {
            comet.element.style.opacity = '0.85';
            comet.isVisible = true;
        }
        
        // Fade out the comet
        function fadeOutComet(comet) {
            comet.element.style.opacity = '0';
            comet.isVisible = false;
            
            // Fade out trail
            if (comet.trail) {
                comet.trail.style.opacity = '0';
                setTimeout(() => {
                    if (comet.trail.parentNode) comet.trail.remove();
                }, 1500);
            }
            
            // Remove comet after fade out
            setTimeout(() => {
                if (comet.element.parentNode) comet.element.remove();
            }, 2000);
        }
        
        // Update comet position
        function updateComet(comet) {
            if (!comet.isVisible) return;
            
            // Move comet
            comet.progress += comet.speed / comet.distance;
            comet.x = comet.x + Math.cos(comet.angle) * comet.speed;
            comet.y = comet.y + Math.sin(comet.angle) * comet.speed;
            
            // Update position
            comet.element.style.left = comet.x + '%';
            comet.element.style.top = comet.y + '%';
            
            // Update trail
            if (comet.trail) {
                comet.trail.style.left = comet.x + '%';
                comet.trail.style.top = comet.y + '%';
                comet.trail.style.transform = `rotate(${comet.angle * 180 / Math.PI}deg)`;
                comet.trail.style.opacity = 0.8 - (comet.progress * 0.8);
            }
            
            // Check if comet has reached destination or out of bounds
            const distanceToEnd = Math.sqrt(
                Math.pow(comet.endX - comet.x, 2) + 
                Math.pow(comet.endY - comet.y, 2)
            );
            
            // Check if within reasonable bounds of division
            const inBounds = comet.x >= -5 && comet.x <= 105 &&
                            comet.y >= -5 && comet.y <= 105;
            
            if (distanceToEnd < 2 || comet.progress >= 0.98 || !inBounds) {
                fadeOutComet(comet);
                return false; // Comet finished
            }
            
            return true; // Comet still moving
        }
        
        // Comet manager
        class CometManager {
            constructor() {
                this.currentComet = null;
                this.animationId = null;
                this.isPaused = false;
                this.startContinuousComets();
            }
            
            startContinuousComets() {
                // Start first comet immediately
                this.currentComet = createComet();
                setTimeout(() => {
                    fadeInComet(this.currentComet);
                    this.animate();
                }, 300);
            }
            
            animate() {
                if (this.isPaused || !this.currentComet) return;
                
                const stillMoving = updateComet(this.currentComet);
                
                if (stillMoving) {
                    this.animationId = requestAnimationFrame(() => this.animate());
                } else {
                    // Comet finished, start new one after delay
                    this.currentComet = null;
                    
                    setTimeout(() => {
                        this.currentComet = createComet();
                        setTimeout(() => {
                            fadeInComet(this.currentComet);
                            this.animate();
                        }, 200);
                    }, 1000);
                }
            }
            
            pause() {
                this.isPaused = true;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            }
            
            resume() {
                this.isPaused = false;
                if (this.currentComet) {
                    this.animate();
                } else {
                    this.startContinuousComets();
                }
            }
        }
        
        // Initialize everything
        window.addEventListener('load', () => {
            createStars();
            
            // Start comet manager
            const cometManager = new CometManager();
            
            // Handle window resize
            window.addEventListener('resize', () => {
                getDivisionBounds();
            });
            
            // Pause/resume on visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    cometManager.pause();
                } else {
                    cometManager.resume();
                }
            });
        });



          // Startup Metrics Data (Feature Adoption focus)
        const metrics = [
            { // Feature Adoption Rate
                val: 68, // percentage
                min: 50,
                max: 85,
                unit: '%',
                prefix: '',
                valId: 'metric1',
                changeId: 'change1',
                descId: 'desc1',
                label: 'Feature Adoption Rate',
                type: 'percentage',
                positiveChange: true, // Higher is better
                emojiUp: '🚀',
                emojiDown: '📊'
            },
            { // Growth Rate
                val: 18.3, // percentage
                min: 5,
                max: 35,
                unit: '%',
                prefix: '',
                valId: 'metric2',
                changeId: 'change2',
                descId: 'desc2',
                label: 'Month-over-Month Growth',
                type: 'percentage',
                positiveChange: true,
                emojiUp: '📈',
                emojiDown: '📉'
            },
            { // Churn Rate
                val: 2.7, // percentage
                min: 1,
                max: 6,
                unit: '%',
                prefix: '',
                valId: 'metric3',
                changeId: 'change3',
                descId: 'desc3',
                label: 'Monthly Churn Rate',
                type: 'percentage',
                positiveChange: false, // Lower is better
                emojiUp: '✅',
                emojiDown: '⚠️'
            }
        ];

        // Create ripple effect
        function createStartupRipple(event, card) {
            const ripple = document.createElement('div');
            ripple.className = 'startup-ripple';
            
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // Update metric value
        /*
        function updateMetric(index) {
            const metric = metrics[index];
            const card = document.querySelectorAll('.startup-card')[index];
            
            // Determine change direction based on metric type
            let change;
            if (index === 0) { // Feature Adoption - usually improves gradually
                change = Math.random() > 0.4 ? 0.8 : -0.3;
            } else if (index === 1) { // Growth - can be volatile
                change = (Math.random() - 0.4) * 3;
            } else { // Churn - usually stable with occasional spikes
                change = Math.random() > 0.8 ? 0.4 : (Math.random() > 0.5 ? -0.1 : 0);
            }
            
            // Apply change
            let newVal = metric.val + change;
            
            // Ensure within bounds
            newVal = Math.max(metric.min, Math.min(metric.max, newVal));
            
            if (Math.abs(newVal - metric.val) > 0.01) {
                // Create ripple
                const event = { 
                    clientX: card.offsetWidth / 2, 
                    clientY: card.offsetHeight / 2 
                };
                createStartupRipple(event, card);
                
                // Update value with animation
                const valueEl = document.getElementById(metric.valId);
                const oldVal = metric.val;
                
                valueEl.classList.add('metric-flash');
                setTimeout(() => valueEl.classList.remove('metric-flash'), 500);
                
                // Format and display value
                valueEl.textContent = `${newVal.toFixed(1)}${metric.unit}`;
                metric.val = newVal;
                
                // Update change indicator
                const changeEl = document.getElementById(metric.changeId);
                const diff = newVal - oldVal;
                const diffFormatted = Math.abs(diff).toFixed(1);
                
                if (metric.positiveChange) {
                    if (diff > 0) {
                        changeEl.textContent = `+${diffFormatted}${metric.unit}`;
                        changeEl.className = 'metric-change positive';
                    } else if (diff < 0) {
                        changeEl.textContent = `-${diffFormatted}${metric.unit}`;
                        changeEl.className = 'metric-change negative';
                    }
                } else {
                    // For churn, lower is better
                    if (diff < 0) {
                        changeEl.textContent = `-${Math.abs(diff).toFixed(1)}${metric.unit}`;
                        changeEl.className = 'metric-change positive';
                    } else if (diff > 0) {
                        changeEl.textContent = `+${diffFormatted}${metric.unit}`;
                        changeEl.className = 'metric-change negative';
                    }
                }
                
                // Update wave animation speed based on metric performance
                const waveBg = card.querySelector('.startup-wave');
                const waves = waveBg.querySelectorAll('.wave-path');
                
                // Calculate performance percentage (0-100%)
                let performance;
                if (metric.positiveChange) {
                    performance = ((newVal - metric.min) / (metric.max - metric.min)) * 100;
                } else {
                    // For churn, reverse the calculation (lower is better)
                    performance = ((metric.max - newVal) / (metric.max - metric.min)) * 100;
                }
                
                // Adjust wave speed based on performance
                const speedFactor = 0.5 + (performance / 200);
                
                waves.forEach((wave, i) => {
                    const baseSpeed = 7 + (i * 2);
                    wave.style.animationDuration = `${baseSpeed / speedFactor}s`;
                });
                
                // Update description with contextual text
                const descEl = document.getElementById(metric.descId);
                let newDescription = '';
                
                if (index === 0) { // Feature Adoption
                    newDescription = `${newVal.toFixed(1)}% adoption rate ${diff > 0 ? metric.emojiUp : metric.emojiDown}`;
                } else if (index === 1) { // Growth
                    newDescription = `${newVal.toFixed(1)}% monthly growth ${diff > 0 ? metric.emojiUp : metric.emojiDown}`;
                } else { // Churn
                    newDescription = `${newVal.toFixed(1)}% user churn ${diff < 0 ? metric.emojiUp : metric.emojiDown}`;
                }
                
                descEl.textContent = newDescription;
                
                // 30% chance to update another metric
                if (Math.random() > 0.7) {
                    setTimeout(() => {
                        const otherIndex = (index + 1) % 3;
                        updateMetric(otherIndex);
                    }, 300);
                }
            }
        }
*/
        // Initialize wave animations
        document.querySelectorAll('.wave-path').forEach((wave, index) => {
            const baseSpeed = 7 + (index * 2);
            wave.style.animationDuration = `${baseSpeed}s`;
        });

        // Add click listeners
        document.querySelectorAll('.startup-card').forEach((card, index) => {
            card.addEventListener('click', function(event) {
                updateMetric(index);
            });
        });

        // Auto-update metrics every 5-8 seconds
        setInterval(() => {
            const randomIndex = Math.floor(Math.random() * 3);
            updateMetric(randomIndex);
        }, Math.random() * 3000 + 5000);

        // Initial contextual descriptions
        setTimeout(() => {
            metrics.forEach((metric, index) => {
                const descEl = document.getElementById(metric.descId);
                
                if (index === 0) {
                    descEl.textContent = `${metric.val.toFixed(1)}% adoption rate ${metric.emojiUp}`;
                } else if (index === 1) {
                    descEl.textContent = `${metric.val.toFixed(1)}% monthly growth ${metric.emojiUp}`;
                } else {
                    descEl.textContent = `${metric.val.toFixed(1)}% user churn ${metric.val < 3 ? '✅' : '⚠️'}`;
                }
            });
        }, 500);

        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('close-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        let currentIndex = 0;
        
        // Open lightbox when image is clicked
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateLightbox();
                lightbox.style.display = 'flex';
            });
        });
        
        // Close lightbox
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
        
        // Close when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
        
        // Previous image
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightbox();
        });
        
        // Next image
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightbox();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    lightbox.style.display = 'none';
                } else if (e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                    updateLightbox();
                } else if (e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % galleryItems.length;
                    updateLightbox();
                }
            }
        });
        
        // Update lightbox image
        function updateLightbox() {
            const imgSrc = galleryItems[currentIndex].querySelector('.gallery-img').src;
            lightboxImg.src = imgSrc;
        }
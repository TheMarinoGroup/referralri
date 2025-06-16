class ReferralDirectory {
    constructor() {
        this.data = null;
        this.currentCategory = null;
        this.init();
    }

    async init() {
        try {
            this.showLoading();
            await this.loadData();
            this.renderServiceCategories();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing directory:', error);
            this.showError('Failed to load business directory');
        }
    }

    async loadData() {
        try {
            const response = await fetch('clients.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    renderServiceCategories() {
        const servicesGrid = document.getElementById('servicesGrid');
        
        if (!this.data || !this.data.categories) {
            this.showError('No data available');
            return;
        }

        servicesGrid.innerHTML = '';

        Object.entries(this.data.categories).forEach(([key, category]) => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.setAttribute('data-category', key);
            
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h3 class="service-title">${category.name}</h3>
                <p class="service-description">
                    ${this.getServiceDescription(key, category.businesses.length)}
                </p>
            `;
            
            serviceCard.addEventListener('click', () => this.showBusinessCategory(key, category));
            servicesGrid.appendChild(serviceCard);
        });
    }

    getServiceDescription(key, businessCount) {
        const descriptions = {
            'Decking': 'Professional deck construction, repair, and maintenance services',
            'Fencing': 'Quality fencing installation and repair for residential and commercial properties',
            'Flooring': 'Expert flooring installation including hardwood, tile, and luxury vinyl',
            'Handyman': 'Reliable handyman services for all your home repair and maintenance needs',
            'Hardscape': 'Beautiful hardscape design and installation for patios, walkways, and more',
            'Remodeling': 'Complete home renovation and remodeling services',
            'HVAC': 'Heating, ventilation, and air conditioning installation and repair',
            'Plumbing': 'Professional plumbing services for repairs, installation, and maintenance',
            'Electrical': 'Licensed electrical services for residential and commercial properties',
            'Roofing': 'Quality roofing installation, repair, and maintenance services',
            'Landscaping': 'Complete landscaping and lawn care services',
            'Painting': 'Professional interior and exterior painting services',
            'PestControl': 'Effective pest control solutions for homes and businesses',
            'TreeServices': 'Professional tree removal, pruning, and care services',
            'Solar': 'Solar panel installation and renewable energy solutions',
            'Windows': 'Window installation and replacement services',
            'Cleaning': 'Professional residential and commercial cleaning services',
            'Pool': 'Complete pool maintenance and repair services',
            'GarageDoor': 'Garage door installation, repair, and maintenance',
            'Security': 'Home security system installation and monitoring'
        };
        
        return descriptions[key] || `Professional ${key.toLowerCase()} services in Rhode Island`;
    }

    showBusinessCategory(categoryKey, category) {
        this.currentCategory = categoryKey;
        
        // Hide services view and show business view
        document.getElementById('servicesView').style.display = 'none';
        document.getElementById('businessView').classList.add('active');
        
        // Render businesses for this category
        this.renderBusinessGrid(category.businesses);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderBusinessGrid(businesses) {
        const businessGrid = document.getElementById('businessGrid');
        
        if (!businesses || businesses.length === 0) {
            businessGrid.innerHTML = '<div class="loading">No businesses available in this category.</div>';
            return;
        }

        businessGrid.innerHTML = businesses.map(business => this.renderBusinessCard(business)).join('');
    }

    renderBusinessCard(business) {
        const stars = this.renderStars(business.rating);
        const ratingClass = this.getRatingClass(business.rating);
        
        return `
            <div class="business-card">
                <div class="business-header">
                    <div>
                        <h3 class="business-name">${business.name}</h3>
                        <div class="rating">
                            ${stars}
                            <span class="rating-badge ${ratingClass}">${business.rating}</span>
                        </div>
                    </div>
                </div>
                
                <div class="business-info">
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${business.location}
                    </div>
                    <div class="services">${business.services}</div>
                    <div class="about">${business.about}</div>
                </div>
                
                <div class="action-buttons">
                    <a href="tel:${business.phone}" class="btn btn-call">
                        <i class="fas fa-phone"></i>
                        Call
                    </a>
                    <a href="sms:${business.phone}" class="btn btn-sms">
                        <i class="fas fa-sms"></i>
                        SMS
                    </a>
                    <a href="${business.website}" target="_blank" rel="noopener noreferrer" class="btn btn-website">
                        <i class="fas fa-globe"></i>
                        Website
                    </a>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    getRatingClass(rating) {
        if (rating >= 4.5) return 'excellent';
        if (rating >= 4.0) return 'very-good';
        if (rating >= 3.5) return 'good';
        if (rating >= 3.0) return 'average';
        return 'poor';
    }

    setupEventListeners() {
        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', () => this.showServicesView());
    }

    showServicesView() {
        // Hide business view and show services view
        document.getElementById('businessView').classList.remove('active');
        document.getElementById('servicesView').style.display = 'block';
        
        this.currentCategory = null;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        const servicesGrid = document.getElementById('servicesGrid');
        servicesGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <p>${message}</p>
            </div>
        `;
    }

    showLoading() {
        const servicesGrid = document.getElementById('servicesGrid');
        servicesGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading business directory...</p>
            </div>
        `;
    }
}

// Initialize the directory when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReferralDirectory();
});

// Add some smooth scrolling for better UX
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
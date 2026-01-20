document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES ---
    const steps = [1, 2, 3, 4];
    let currentStep = 1;

    // DOM Elements
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const btnSubmit = document.getElementById('btn-submit');
    const form = document.getElementById('create-listing-form');

    // Inputs for Preview Updates
    const inputTitle = document.getElementById('ad-title');
    const inputPrice = document.getElementById('ad-price');
    const inputDesc = document.getElementById('ad-description');
    const inputCategory = document.getElementsByName('category');

    // Preview Elements
    const previewTitle = document.getElementById('preview-title');
    const previewPrice = document.getElementById('preview-price');
    const previewDesc = document.getElementById('preview-desc');
    const previewCategory = document.getElementById('preview-category');
    const previewBadgeUrgent = document.getElementById('preview-badge-urgent');
    const previewBadgeFeatured = document.getElementById('preview-badge-featured');

    // Boost Inputs
    const checkFeatured = document.getElementById('boost-featured');
    const checkUrgent = document.getElementById('boost-urgent');
    const totalAddons = document.getElementById('total-addons');
    const grandTotal = document.getElementById('grand-total');

    // --- FUNCTIONS ---

    // 1. UPDATE STEP UI
    function updateStepUI() {
        // Show/Hide Step Content
        document.querySelectorAll('.form-step').forEach(el => {
            el.classList.add('hidden');
            if (parseInt(el.dataset.stepContent) === currentStep) {
                el.classList.remove('hidden');
            }
        });

        // Update Indicators
        const indicators = document.querySelectorAll('.step-indicator'); // The circles

        indicators.forEach((ind, index) => {
            const stepNum = index + 1;
            const stepParent = ind.parentElement; // The container div

            // Reset classes
            ind.classList.remove('step-active', 'step-completed', 'step-inactive');
            ind.querySelector('.icon').classList.add('hidden');
            ind.querySelector('.number').classList.remove('hidden');

            if (stepNum < currentStep) {
                // Completed
                ind.classList.add('step-completed');
                ind.querySelector('.icon').classList.remove('hidden');
                ind.querySelector('.number').classList.add('hidden');
            } else if (stepNum === currentStep) {
                // Active
                ind.classList.add('step-active');
            } else {
                // Inactive
                ind.classList.add('step-inactive');
            }
        });

        // Update Buttons
        if (currentStep === 1) {
            btnBack.classList.add('hidden');
        } else {
            btnBack.classList.remove('hidden');
        }

        if (currentStep === steps.length) {
            btnNext.classList.add('hidden');
            btnSubmit.classList.remove('hidden');
            updatePreview(); // Ensure preview is fresh
        } else {
            btnNext.classList.remove('hidden');
            btnSubmit.classList.add('hidden');
        }
    }

    // 2. NAVIGATION HANDLERS
    btnNext.addEventListener('click', () => {
        if (currentStep < steps.length) {
            if (validateStep(currentStep)) {
                currentStep++;
                updateStepUI();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepUI();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // 3. VALIDATION (Simple)
    function validateStep(step) {
        if (step === 2) {
            if (!inputTitle.value.trim()) {
                alert('Please enter an Ad Title');
                inputTitle.focus();
                return false;
            }
            if (!inputPrice.value.trim()) {
                alert('Please enter a Price');
                inputPrice.focus();
                return false;
            }
        }
        return true;
    }

    // 4. LIVE PREVIEW LOGIC
    function updatePreview() {
        // Title
        previewTitle.textContent = inputTitle.value || 'Untitled Ad';

        // Price
        const price = parseFloat(inputPrice.value) || 0;
        previewPrice.textContent = '$' + price.toFixed(2);

        // Desc
        previewDesc.textContent = inputDesc.value || 'No description provided...';

        // Category
        let selectedCat = 'General';
        inputCategory.forEach(radio => {
            if (radio.checked) selectedCat = radio.parentElement.querySelector('span').innerText;
        });
        previewCategory.textContent = selectedCat;
    }

    // 5. PRICE CALCULATION
    function updateTotals() {
        let addonCost = 0;
        if (checkFeatured.checked) addonCost += 10;
        if (checkUrgent.checked) addonCost += 5;

        // Update Badges
        if (checkUrgent.checked) previewBadgeUrgent.classList.remove('hidden');
        else previewBadgeUrgent.classList.add('hidden');

        if (checkFeatured.checked) previewBadgeFeatured.classList.remove('hidden');
        else previewBadgeFeatured.classList.add('hidden');

        totalAddons.textContent = '+$' + addonCost.toFixed(2);
        grandTotal.textContent = '$' + addonCost.toFixed(2);
    }

    // Listeners for inputs
    checkFeatured.addEventListener('change', updateTotals);
    checkUrgent.addEventListener('change', updateTotals);

    // Also update preview when inputs change in real-time (optional but nice)
    [inputTitle, inputPrice, inputDesc].forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // 6. FILE UPLOAD VISUALS (Drag & Drop)
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-upload');
    const previewGrid = document.getElementById('image-preview-grid');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            // Clear previous for this demo or append? Let's append.
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        const div = document.createElement('div');
                        div.className = 'relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800';
                        div.innerHTML = `
                           <img src="${reader.result}" class="w-full h-full object-cover">
                           <button class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
                               <i class="fas fa-times text-xs"></i>
                           </button>
                       `;
                        previewGrid.appendChild(div);

                        // Valid trick: update main preview image with first uploaded
                        const mainPrev = document.getElementById('preview-image-main');
                        mainPrev.src = reader.result;
                    }
                }
            });
        }
    }

    // Initialize
    updateStepUI();
    updateTotals(); // Init totals
});

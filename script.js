fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`فشل في تحميل ملف JSON: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const elements = {
            company: data.company || '',
            name: data.name || '',
            title: data.title || '',
            email: data.email || '',
            email1: data.email1 || '',
            website: data.website || '',
            whatsapp: data.whatsapp || ''
        };

        // Company
        const companyElement = document.getElementById('company');
        if (companyElement) companyElement.textContent = elements.company;

        // الاسم
        const nameElement = document.getElementById('name');
        if (nameElement) nameElement.textContent = elements.name;

        // العنوان / الوظيفة
        const titleElement = document.getElementById('title');
        if (titleElement) titleElement.textContent = elements.title;

        // الإيميل الأساسي
        const emailElement = document.getElementById('email');
        if (emailElement) {
            emailElement.href = `mailto:${elements.email}`;
            emailElement.textContent = elements.email;
        }

        // الإيميل الثاني
        const emailElement1 = document.getElementById('email1');
        if (emailElement1) {
            emailElement1.href = `mailto:${elements.email1}`;
            emailElement1.textContent = elements.email1;
        }

        // الموقع
        const websiteElement = document.getElementById('website');
        if (websiteElement) {
            let siteUrl = elements.website;
            if (siteUrl && !siteUrl.toLowerCase().startsWith('http://') && !siteUrl.toLowerCase().startsWith('https://')) {
                siteUrl = "https://" + siteUrl;
            }
            websiteElement.href = siteUrl;
            websiteElement.textContent = elements.website;
        }

        // واتساب
        const whatsappElement = document.getElementById('whatsapp');
        if (whatsappElement) {
            whatsappElement.href = `https://wa.me/${elements.whatsapp}`;
            whatsappElement.textContent = elements.whatsapp;
        }

        // تحميل vCard
        window.downloadVCard = function() {
            const vCardData = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `ORG:${elements.company}`,
                `N:${(elements.name || '').split(' ').reverse().join(';')}`,
                `FN:${elements.name}`,
                `TITLE:${elements.title}`,
                elements.email ? `EMAIL;TYPE=PREF:${elements.email}` : '',
                elements.email1 ? `EMAIL;TYPE=WORK,INTERNET:${elements.email1}` : '',
                elements.website ? `URL:${elements.website}` : '',
                elements.whatsapp ? `TEL;TYPE=Phone:${elements.whatsapp}` : '',
                'END:VCARD'
            ].filter(line => line).join('\n');

            const blob = new Blob([vCardData], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'contact.vcf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };

        // الوضع الليلي
        window.toggleDarkMode = function() {
            const elementsToToggle = [
                document.body,
                document.querySelector('.card'),
                ...document.querySelectorAll('.detail-item'),
                document.querySelector('.vcard-btn'),
                document.querySelector('.dark-mode-toggle'),
                ...document.querySelectorAll('h1'),
                ...document.querySelectorAll('h2')
            ];
            elementsToToggle.forEach(el => el?.classList.toggle('light-mode'));

            const icon = document.getElementById('dark-mode-icon');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        };
    })
    .catch(error => {
        console.error('خطأ في تحميل البيانات:', error);
        alert('حدث خطأ في تحميل البيانات، يرجى التحقق من اتصال الإنترنت أو ملف data.json');
    });


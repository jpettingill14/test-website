document.getElementById('genai-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const industry = document.getElementById('industry').value;
    const companySize = document.getElementById('company-size').value;
    const productInterest = document.getElementById('product-interest').value;
    
    document.getElementById('result').textContent = 'Generating message...';
    
    try {
        const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ industry, companySize, productInterest }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Helper function to convert string to sentence case
        function toSentenceCase(str) {
            return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function(c) {
                return c.toUpperCase();
            });
        }
        
        // Process the AI response to remove tags like "Headline" and "CTA Button"
        const cleanedMessage = data.message
            .replace(/Headline:\s*/i, '') // Remove "Headline" label
            .replace(/CTA Button:\s*/i, ''); // Remove "CTA Button" label
        
        const [headline, cta] = cleanedMessage.split('\n').map(line => line.trim().replace(/^"|"$/g, ''));
        
        // Convert headline and cta to sentence case
        const sentenceCaseHeadline = toSentenceCase(headline);
        const sentenceCaseCta = toSentenceCase(cta);
        
        document.getElementById('result').textContent = cleanedMessage;
        document.getElementById('hero-headline').textContent = sentenceCaseHeadline;
        document.getElementById('hero-cta').textContent = sentenceCaseCta;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('result').textContent = 'An error occurred while generating the message.';
        }
        });
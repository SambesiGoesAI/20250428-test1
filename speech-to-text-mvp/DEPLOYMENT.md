# Deployment Guide

Step-by-step guide to deploy your Speech-to-Text MVP to production.

## Pre-Deployment Checklist

- [ ] Get production Deepgram API key
- [ ] Test application locally with production API key
- [ ] Build and test production bundle
- [ ] Choose hosting platform
- [ ] Prepare domain name (optional)

## Hosting Platforms

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Free tier available
- Automatic HTTPS
- Easy environment variable management
- Git integration
- Zero configuration

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd speech-to-text-mvp
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_DEEPGRAM_API_KEY production
   ```
   Then paste your API key when prompted.

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

**Via Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Add environment variable:
   - Name: `VITE_DEEPGRAM_API_KEY`
   - Value: Your Deepgram API key
5. Click "Deploy"

---

### Option 2: Netlify

**Steps:**

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login**
   ```bash
   netlify login
   ```

4. **Deploy**
   ```bash
   netlify deploy
   ```

5. **Set Environment Variables**
   - Go to Netlify dashboard
   - Site Settings > Environment Variables
   - Add `VITE_DEEPGRAM_API_KEY`

6. **Deploy to production**
   ```bash
   netlify deploy --prod
   ```

---

### Option 3: GitHub Pages

**Note**: Requires additional configuration for environment variables.

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/speech-to-text-mvp"
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default {
     base: '/speech-to-text-mvp/',
     // ... rest of config
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

**For environment variables**: Use GitHub Secrets and GitHub Actions.

---

### Option 4: AWS Amplify

1. Go to AWS Amplify Console
2. Connect your Git repository
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable `VITE_DEEPGRAM_API_KEY`
5. Deploy

---

## Environment Variables Setup

### For All Platforms

You need to set:

```
VITE_DEEPGRAM_API_KEY=your_production_api_key
```

### Getting Production API Key

1. Go to [Deepgram Console](https://console.deepgram.com/)
2. Create a new project (production)
3. Generate a new API key
4. Copy the key
5. Add to your hosting platform

### Security Best Practices

- **Never** commit API keys to Git
- Use different API keys for development/production
- Rotate keys regularly
- Set usage limits in Deepgram dashboard
- Monitor API usage

---

## Build Optimization

### Before Deploying

1. **Test production build locally**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check bundle size**
   ```bash
   npm run build
   # Check dist/assets/*.js size
   ```

3. **Run linter**
   ```bash
   npm run lint
   ```

### Optimization Tips

1. **Enable gzip compression** (most hosts do this automatically)

2. **Add to vite.config.js for smaller bundles:**
   ```javascript
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom']
           }
         }
       }
     }
   }
   ```

3. **Lazy load components if needed:**
   ```javascript
   const AudioRecorder = lazy(() => import('./components/AudioRecorder'))
   ```

---

## Domain Configuration

### Using Custom Domain

#### Vercel
1. Go to project settings
2. Domains tab
3. Add your domain
4. Configure DNS records as shown

#### Netlify
1. Domain settings
2. Add custom domain
3. Update DNS with Netlify nameservers

---

## SSL/HTTPS

**Required for microphone access!**

All recommended platforms provide automatic HTTPS:
- ✅ Vercel: Automatic
- ✅ Netlify: Automatic
- ✅ AWS Amplify: Automatic
- ✅ GitHub Pages: Automatic

---

## Post-Deployment Testing

### Test Checklist

- [ ] Visit the deployed URL
- [ ] Check HTTPS is enabled (padlock icon)
- [ ] Test microphone button click
- [ ] Allow microphone permissions
- [ ] Record a test message
- [ ] Verify transcription appears
- [ ] Test copy to clipboard
- [ ] Test clear transcript
- [ ] Check on mobile device
- [ ] Test in different browsers

### Browser Testing

Test on:
- Chrome (desktop & mobile)
- Firefox (desktop & mobile)
- Safari (desktop & mobile)
- Edge (desktop)

---

## Monitoring & Analytics

### Add Analytics (Optional)

1. **Google Analytics**
   ```bash
   npm install react-ga4
   ```

   ```javascript
   // In App.jsx
   import ReactGA from 'react-ga4';

   useEffect(() => {
     ReactGA.initialize('G-XXXXXXXXXX');
     ReactGA.send('pageview');
   }, []);
   ```

2. **Track Transcription Events**
   ```javascript
   const handleTranscriptionComplete = (result) => {
     ReactGA.event({
       category: 'Transcription',
       action: 'Complete',
       value: result.confidence
     });
   };
   ```

### Monitoring Deepgram Usage

1. Go to Deepgram Console
2. View usage dashboard
3. Set up usage alerts
4. Monitor costs

---

## Troubleshooting Deployment Issues

### "Microphone not working in production"
- ✅ Ensure HTTPS is enabled
- ✅ Check browser permissions
- ✅ Test on localhost first

### "API key not found"
- ✅ Verify environment variable name is `VITE_DEEPGRAM_API_KEY`
- ✅ Redeploy after adding env vars
- ✅ Check build logs for errors

### "Transcription fails"
- ✅ Verify API key is valid
- ✅ Check Deepgram API status
- ✅ Review browser console errors
- ✅ Check network tab for failed requests

### "Blank page after deployment"
- ✅ Check browser console for errors
- ✅ Verify base URL in vite.config.js
- ✅ Ensure all files are in dist/
- ✅ Check build logs

---

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_DEEPGRAM_API_KEY: ${{ secrets.DEEPGRAM_API_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Rollback Plan

If deployment fails:

### Vercel
```bash
vercel rollback
```

### Netlify
- Go to Deploys tab
- Click on previous successful deploy
- Click "Publish deploy"

### Manual
```bash
git revert HEAD
git push
# Redeploy
```

---

## Scaling Considerations

### As Your App Grows

1. **API Rate Limits**
   - Monitor Deepgram usage
   - Implement request queuing
   - Add user authentication

2. **Caching**
   - Cache similar audio clips
   - Store transcripts in database
   - Use CDN for assets

3. **Error Tracking**
   - Add Sentry or similar
   - Monitor error rates
   - Set up alerts

---

## Cost Estimation

### Deepgram Pricing (as of 2026)
- Pay-as-you-go: ~$0.0125/minute
- $200 free credits for new users
- ~16,000 minutes of transcription with free credits

### Hosting (Free Tiers)
- Vercel: Free for personal projects
- Netlify: Free for personal projects
- GitHub Pages: Free
- AWS Amplify: Free tier available

### Total Cost
For small projects: **$0 - $10/month**

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Deepgram Documentation](https://developers.deepgram.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Production Checklist

Final checklist before going live:

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] API usage monitoring set up
- [ ] Error tracking enabled (optional)
- [ ] Analytics configured (optional)
- [ ] Custom domain configured (optional)
- [ ] Backup/rollback plan ready
- [ ] Documentation updated

---

**Your app is ready for production!**

Visit your deployed URL and start transcribing speech to text.

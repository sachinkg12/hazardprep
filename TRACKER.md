# MyHazardProfile — Project Tracker

## Phase 1: Core Engine (Scaffold)
- [x] Initialize monorepo (pnpm + Turborepo)
- [x] Define models: Location, HazardType, HazardScore, HazardProfile, DataProvider
- [x] Implement BaseProvider with caching
- [x] Build FEMA provider (OpenFEMA disaster declarations)
- [x] Build USGS Earthquake provider
- [x] Build NOAA Weather/Alerts provider
- [x] Build NIFC Wildfire provider
- [x] Implement HazardScorer (parallel provider execution)
- [x] Implement HazardAggregator (weighted composite scoring + recommendations)
- [x] US Census geocoder (free, no API key)
- [x] Unit tests (8 passing)
- [x] CI/CD GitHub Actions workflow
- [x] Issue templates (bug, feature, data source request)
- [x] README, CONTRIBUTING, LICENSE (MIT)

## Phase 2: Web Dashboard
- [ ] Create Next.js app (`apps/web`)
- [ ] Landing page with address input + autocomplete
- [ ] API route wrapping `@myhazardprofile/core`
- [ ] Risk profile results page (composite score, per-hazard breakdown)
- [ ] Interactive map with hazard zone visualization (Leaflet)
- [ ] Risk gauge / chart components
- [ ] Mobile-responsive design
- [ ] Deploy to Vercel

## Phase 3: Polish & Publish
- [ ] Publish `@myhazardprofile/core` to npm
- [ ] Create GitHub repo and push
- [ ] Add badges to README (npm version, CI, license)
- [ ] Core package standalone README with API docs
- [ ] Add nearest shelter lookup feature
- [ ] Add more providers (USDA Drought Monitor, NOAA historical storms)

## Phase 4: EB-1A Traction
- [ ] Write methodology blog post / arXiv preprint
- [ ] Present at Code for America / SF Civic Tech meetup
- [ ] Submit to CHI / CSCW / ACM COMPASS
- [ ] Pitch to local TV news (seasonal hooks: hurricane/wildfire season)
- [ ] Reach out to FEMA social media for amplification
- [ ] Get partnership with a city emergency management office
- [ ] Collect recommendation letters (emergency management directors, FEMA officials)

## Data Sources Reference
| Source | Agency | API | Key Required |
|--------|--------|-----|--------------|
| OpenFEMA | FEMA | https://www.fema.gov/api/open/v2/ | No |
| Earthquake Hazards | USGS | https://earthquake.usgs.gov/fdsnws/event/1/ | No |
| Weather API | NOAA/NWS | https://api.weather.gov/ | No |
| NIFC Wildfire | NIFC | ArcGIS REST Services | No |
| Census Geocoder | US Census | https://geocoding.geo.census.gov/ | No |

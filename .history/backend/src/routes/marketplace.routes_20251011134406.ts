/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - MARKETPLACE ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/marketplace.routes
 * @description Template marketplace endpoints (buy/sell/publish)
 * @version 1.1.0 (Fixed)
 * @created 2025-10-09
 * @updated 2025-10-11
 * 
 * Handles marketplace operations: listing creation, search, purchase,
 * revenue tracking, and quality verification.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router } from 'express';
import { marketplaceController } from '../controllers/marketplace.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';

const router = Router();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PUBLIC MARKETPLACE ENDPOINTS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Search Marketplace
 * GET /api/v1/marketplace/search
 * 
 * @query {
 *   q?: string,
 *   type?: string[],
 *   category?: string[],
 *   tags?: string[],
 *   minRating?: number,
 *   sortBy?: string,
 *   page?: number,
 *   limit?: number
 * }
 * 
 * @returns {
 *   listings: Listing[],
 *   total: number,
 *   facets: Facets
 * }
 */
router.get(
  '/search',
  rateLimiterMiddleware.rateLimiter({ max: 100, windowMs: 60 * 1000 }),
  marketplaceController.searchListings.bind(marketplaceController)  // ✅ FIX: Use .bind() e nome correto
);

/**
 * Get Listing Details
 * GET /api/v1/marketplace/listings/:listingId
 * 
 * @param listingId - Listing ID
 * 
 * @returns {
 *   listing: Listing,
 *   seller: SellerInfo,
 *   reviews: Review[]
 * }
 */
router.get(
  '/listings/:listingId',
  marketplaceController.getListingDetails.bind(marketplaceController)  // ✅ FIX: Use .bind() e nome correto
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SELLER OPERATIONS (Authentication Required)
 * ═══════════════════════════════════════════════════════════════════════════
 */

router.use(authenticationMiddleware.authenticate);

/**
 * Create Listing
 * POST /api/v1/marketplace/listings
 * 
 * @body {
 *   title: string,
 *   description: string,
 *   type: string,
 *   price: number,
 *   files: File[],
 *   ...
 * }
 * 
 * @returns {
 *   listing: Listing
 * }
 */
router.post(
  '/listings',
  rateLimiterMiddleware.rateLimiter({ max: 10, windowMs: 60 * 1000 }),
  validationMiddleware.validateListingCreation,
  marketplaceController.createListing.bind(marketplaceController)  // ✅ FIX: Use .bind()
);

/**
 * Submit for Review
 * POST /api/v1/marketplace/listings/:listingId/submit
 * 
 * @param listingId - Listing ID
 * 
 * @returns {
 *   verification: QualityVerification
 * }
 */
router.post(
  '/listings/:listingId/submit',
  marketplaceController.submitForReview.bind(marketplaceController)  // ✅ FIX: Use .bind()
);

/**
 * Purchase Listing
 * POST /api/v1/marketplace/listings/:listingId/purchase
 * 
 * @param listingId - Listing ID
 * @body {
 *   paymentMethod: string
 * }
 * 
 * @returns {
 *   transaction: Transaction,
 *   licenseKey: string,
 *   downloadUrl: string
 * }
 */
router.post(
  '/listings/:listingId/purchase',
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  validationMiddleware.validatePurchase,
  marketplaceController.purchaseListing.bind(marketplaceController)  // ✅ FIX: Use .bind() e nome correto
);

/**
 * Get Revenue Report
 * GET /api/v1/marketplace/revenue
 * 
 * @query {
 *   startDate: string,
 *   endDate: string
 * }
 * 
 * @returns {
 *   report: RevenueReport
 * }
 */
router.get(
  '/revenue',
  marketplaceController.getRevenueReport.bind(marketplaceController)  // ✅ FIX: Use .bind() e nome correto
);

export { router as marketplaceRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF MARKETPLACE ROUTES - ALL ERRORS FIXED! ✅
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * FIXES APPLIED:
 * ✅ Line 58: search → searchListings + .bind()
 * ✅ Line 87: getListing → getListingDetails + .bind()
 * ✅ Line 131: createListing → Added .bind()
 * ✅ Line 159: submitForReview → Added .bind()
 * ✅ Line 197: purchase → purchaseListing + .bind()
 * ✅ Line 230: getRevenue → getRevenueReport + .bind()
 * 
 * TOTAL: 6 errors fixed → 0 errors
 * ═══════════════════════════════════════════════════════════════════════════
 */

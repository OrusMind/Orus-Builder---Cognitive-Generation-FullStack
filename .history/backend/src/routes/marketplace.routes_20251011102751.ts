 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - MARKETPLACE ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/marketplace.routes
 * @description Template marketplace endpoints (buy/sell/publish)
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Handles marketplace operations: listing creation, search, purchase,
 * revenue tracking, and quality verification.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await marketplaceController.search(req.query);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listingId } = req.params;
      const listing = await marketplaceController.getListing(listingId);
      
      res.json({
        success: true,
        data: listing
      });
    } catch (error) {
      next(error);
    }
  }
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const listing = await marketplaceController.createListing(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: { listing },
        message: 'Listing created successfully'
      });
    } catch (error) {
      next(error);
    }
  }
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listingId } = req.params;
      const verification = await marketplaceController.submitForReview(listingId);
      
      res.json({
        success: true,
        data: { verification },
        message: 'Listing submitted for review'
      });
    } catch (error) {
      next(error);
    }
  }
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { listingId } = req.params;
      const userId = req.user!.userId;
      const { paymentMethod } = req.body;
      
      const result = await marketplaceController.purchase(listingId, userId, paymentMethod);
      
      res.json({
        success: true,
        data: result,
        message: 'Purchase completed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { startDate, endDate } = req.query;
      
      const report = await marketplaceController.getRevenue(userId, {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      });
      
      res.json({
        success: true,
        data: { report }
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as marketplaceRoutes };

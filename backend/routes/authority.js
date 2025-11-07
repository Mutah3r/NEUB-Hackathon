const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const controller = require('../controllers/authority');

const router = express.Router();

/**
 * @swagger
 * /api/authority/register:
 *   post:
 *     summary: Create a new authority (restricted)
 *     tags: [Authority]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Authority created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict
 */
// Only an existing authority can create another authority
router.post('/register', authenticateToken, authorizeRoles('authority'), controller.register);

/**
 * @swagger
 * /api/authority/login:
 *   post:
 *     summary: Authority login
 *     tags: [Authority]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 */
// Authority login with email/password
router.post('/login', controller.login);

/**
 * @swagger
 * /api/authority/citizen:
 *   post:
 *     summary: Create a citizen directly (authority only, no OTP)
 *     tags: [Authority]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reg_no]
 *             properties:
 *               name:
 *                 type: string
 *               reg_no:
 *                 type: string
 *               NID_no:
 *                 type: string
 *               Birth_Certificate_no:
 *                 type: string
 *               NID_or_Birth:
 *                 type: boolean
 *               gender:
 *                 type: string
 *               DOB:
 *                 type: string
 *                 format: date
 *               phone_number:
 *                 type: string
 *               vaccine_certificate_qr:
 *                 type: string
 *               vaccine_taken:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     vaccine_id:
 *                       type: string
 *                     vaccine_name:
 *                       type: string
 *                     time_stamp:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Citizen created
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict (duplicate reg_no)
 */
router.post('/citizen', authenticateToken, authorizeRoles('authority'), controller.addCitizenDirect);

module.exports = router;
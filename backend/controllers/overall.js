const Authority = require('../models/authority');
const Citizen = require('../models/citizen');
const VaccCentre = require('../models/vacc_centre');

async function getUser(req, res) {
  try {
    const role = req.user?.role;
    const sub = req.user?.sub;
    if (!role) {
      return res.status(400).json({ message: 'Role missing in token' });
    }
    if (role === 'authority') {
      const doc = await Authority.findById(sub);
      if (!doc) return res.status(404).json({ message: 'Authority not found' });
      return res.json({ id: doc._id.toString(), name: doc.name, role, email: doc.email });
    }
    if (role === 'citizen') {
      const doc = await Citizen.findById(sub);
      if (!doc) return res.status(404).json({ message: 'Citizen not found' });
      return res.json({
        id: doc._id.toString(),
        name: doc.name,
        role,
        reg_no: doc.reg_no,
        NID_no: doc.NID_no,
        Birth_Certificate_no: doc.Birth_Certificate_no,
        NID_or_Birth: doc.NID_or_Birth,
        gender: doc.gender,
        DOB: doc.DOB,
        phone_number: doc.phone_number,
      });
    }
    if (role === 'vacc_centre') {
      const doc = await VaccCentre.findById(sub);
      if (!doc) return res.status(404).json({ message: 'Centre not found' });
      const staff_count = Array.isArray(doc.staffs) ? doc.staffs.length : 0;
      return res.json({
        id: doc._id.toString(),
        name: doc.name,
        role,
        vc_id: doc.vc_id,
        location: doc.location,
        district: doc.district,
        lattitude: doc.lattitude,
        longitude: doc.longitude,
        staff_count,
      });
    }
    if (role === 'staff') {
      const { vc_id, staff_id } = req.user;
      if (!vc_id || !staff_id) {
        return res.status(400).json({ message: 'vc_id or staff_id missing in token' });
      }
      const centre = await VaccCentre.findOne({ vc_id });
      if (!centre) return res.status(404).json({ message: 'Centre not found' });
      const staff = (Array.isArray(centre.staffs) ? centre.staffs : []).find((s) => String(s.id) === String(staff_id));
      if (!staff) return res.status(404).json({ message: 'Staff not found' });
      return res.json({ id: staff.id, name: staff.name, role, vc_id: centre.vc_id, centre_name: centre.name });
    }
    return res.status(400).json({ message: 'Unknown role' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get user' });
  }
}

module.exports = { getUser };
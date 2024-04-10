const superAdminController = (req, res) => {
  res.status(200).json({ message: "SuperAdmin route accessed." });
};

module.exports = superAdminController;

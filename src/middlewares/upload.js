import sharp from 'sharp';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file.path);

  try {
    // Create 160x160 png thumbnail with sharp
    const thumbnailPath = req.file.path + '_thumb';
    await sharp(req.file.path).resize(160, 160).png().toFile(thumbnailPath);

    console.log('Thumbnail created:', thumbnailPath);
    next();
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    next(error);
  }
};

export { createThumbnail };

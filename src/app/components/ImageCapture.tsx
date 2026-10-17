import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CameraAlt, Image, Close } from '@mui/icons-material';
import { compressImage, fileToBase64, isImageFile } from '../utils/imageUtils';

interface ImageCaptureProps {
  onImageCapture: (imageUrl: string) => void;
  currentImage?: string;
}

export function ImageCapture({ onImageCapture, currentImage }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    if (!isImageFile(file)) {
      setError('يرجى اختيار ملف صورة صالح');
      return;
    }

    setLoading(true);

    try {
      // Compress image
      const compressedFile = await compressImage(file);

      // Convert to base64
      const base64 = await fileToBase64(compressedFile);

      setPreview(base64);
      onImageCapture(base64);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('فشل في معالجة الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClearImage = () => {
    setPreview(null);
    onImageCapture('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <Box>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!preview ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 4,
            border: '2px dashed',
            borderColor: 'primary.light',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'grey.100',
            },
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h6" gutterBottom color="text.primary" sx={{ fontWeight: 800 }}>
                إضافة صورة الفاتورة
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
                التقط صورة للفاتورة أو ارفعها من معرض الصور
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%', maxWidth: 320 }}>
                <Button
                  variant="contained"
                  startIcon={<CameraAlt sx={{ ml: 1, mr: -1 }} />}
                  onClick={() => cameraInputRef.current?.click()}
                  size="large"
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    py: 1.8,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    '& .MuiButton-startIcon': { marginLeft: '12px', marginRight: '-4px' }
                  }}
                >
                  التقاط صورة
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Image sx={{ ml: 1, mr: -1 }} />}
                  onClick={() => fileInputRef.current?.click()}
                  size="large"
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    py: 1.8,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    border: '2px solid',
                    '&:hover': { border: '2px solid' },
                    '& .MuiButton-startIcon': { marginLeft: '12px', marginRight: '-4px' }
                  }}
                >
                  رفع من المعرض
                </Button>
              </Box>
            </>
          )}
        </Paper>
      ) : (
        <Paper
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box
            component="img"
            src={preview}
            alt="Invoice Preview"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 400,
              objectFit: 'contain',
              display: 'block',
              backgroundColor: 'grey.50',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleClearImage}
              aria-label="إزالة الصورة"
              sx={{
                borderRadius: 2,
                minWidth: 'auto',
                p: 1,
                backgroundColor: 'rgba(211, 47, 47, 0.9)',
                backdropFilter: 'blur(4px)',
                '&:hover': { backgroundColor: 'rgb(211, 47, 47)' },
              }}
            >
              <Close fontSize="small" />
            </Button>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<CameraAlt />}
              onClick={() => cameraInputRef.current?.click()}
              size="small"
              sx={{ borderRadius: 2, fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.9)', color: 'text.primary', '&:hover': { backgroundColor: '#fff' } }}
            >
              تغيير الصورة
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

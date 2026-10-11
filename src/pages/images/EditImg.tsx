import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAuth} from '../../context/AuthContext';
import {useImageContext} from '../../context/ImageContext';
import CustomButton from '../../components/CustomButtonProps';
import {useToast} from '../../context/ToastContext';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import {useTheme} from '../../context/MainContext';
import GlobalText from '../../components/GlobalText';
import Avatar from '../../components/image/Avatar';
import ImagePickerGrid from '../../components/image/ImagePickerGrid';
import ImageSlider from '../../components/image/ImageSlider';
import ConfirmModal from '../../components/image/ConfirmModal';
import {useVerificationStatus} from '../../api/mutations/verification/useVerification';
import {useNavigation} from '@react-navigation/native';

const BASE_URL = __DEV__
  ? 'http://192.168.0.133:5001'
  : 'https://your-production-url.com';

const EditImg = () => {
  const {user} = useAuth();
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const {showToast} = useToast();
  const navigation = useNavigation();
  const {images, refetch, uploadImage, deleteImage, setMainImage} =
    useImageContext();
  const {data: verificationData} = useVerificationStatus();
  const isVerified = verificationData?.verified;

  const fullImages = useMemo(
    () =>
      images.map(img => ({
        ...img,
        url: img.url?.startsWith('http')
          ? img.url
          : `${BASE_URL}${img.url}?t=${Date.now()}`,
      })),
    [images],
  );

  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [remainingCount, setRemainingCount] = useState(0);

  // مودال‌ها
  const [confirmPickVisible, setConfirmPickVisible] = useState(false);
  const [confirmMainVisible, setConfirmMainVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // ← جدید
  const [pendingMainUrl, setPendingMainUrl] = useState<string | null>(null);
  const [pendingDeleteImg, setPendingDeleteImg] = useState<any | null>(null); // ← جدید

  // ─── مودال قبل از آپلود: بپرس عکس اصلی انتخاب شده؟ ───────────────────────
  const [confirmUploadVisible, setConfirmUploadVisible] = useState(false); // ← جدید

  useEffect(() => {
    const main = images.find(img => img.isMain);
    setMainImageUrl(
      main
        ? main.url?.startsWith('http')
          ? main.url
          : `${BASE_URL}${main.url}?t=${Date.now()}`
        : null,
    );
  }, [images]);

  const handlePickImages = () => {
    if (images.length >= 3) {
      showToast('شما قبلاً سه تصویر آپلود کرده‌اید.', 'error');
      return;
    }
    setRemainingCount(3 - images.length);
    setConfirmPickVisible(true);
  };

  const launchPicker = () => {
    setConfirmPickVisible(false);
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: remainingCount},
      response => {
        if (response.assets) {
          const valid = response.assets.filter(
            a => a.uri && a.type?.startsWith('image/'),
          );
          if (valid.length > remainingCount) {
            showToast(`حداکثر ${remainingCount} تصویر مجاز است`, 'error');
            return;
          }
          setSelectedFiles(valid);
          setPreviewUrls(valid.map(a => a.uri!));
        }
      },
    );
  };

  // ← وقتی آپلود زده میشه، اول بپرس عکس اصلی انتخاب کردی؟
  const handleUploadPress = () => {
    if (selectedFiles.length === 0) {
      showToast('هیچ تصویری انتخاب نکرده‌اید.');
      return;
    }
    const allUrls = [...images.map(i => i.url), ...previewUrls];
    const hasMain =
      mainImageUrl &&
      allUrls.some(
        u =>
          u === mainImageUrl ||
          `${BASE_URL}${u}` === mainImageUrl?.split('?')[0],
      );

    if (!hasMain) {
      // بپرس می‌خوای عکس اصلی انتخاب کنی؟
      setConfirmUploadVisible(true);
    } else {
      doUpload();
    }
  };

  const doUpload = async () => {
    setConfirmUploadVisible(false);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const isMain = previewUrls[i] === mainImageUrl;
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.fileName,
          type: file.type,
        });
        formData.append('phone', user?.phone ?? '');
        formData.append('isMain', isMain.toString());
        await uploadImage.mutateAsync(formData);
      }
      setSelectedFiles([]);
      setPreviewUrls([]);
      setMainImageUrl(null);
      refetch();
      showToast('تصاویر با موفقیت آپلود شدند', 'success');
    } catch {
      showToast('آپلود ناموفق بود', 'error');
    }
  };

  const handleRemovePreview = (index: number) => {
    if (mainImageUrl === previewUrls[index]) setMainImageUrl(null);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectMainImage = (url: string) => {
    setPendingMainUrl(url);
    setConfirmMainVisible(true);
  };

  const confirmSetMainImage = () => {
    if (!pendingMainUrl) return;
    setMainImageUrl(pendingMainUrl);
    const isFromGallery = images.some(
      img => `${BASE_URL}${img.url}` === pendingMainUrl.split('?')[0],
    );
    if (isFromGallery) {
      const clean = pendingMainUrl.replace(BASE_URL, '').split('?')[0];
      setMainImage.mutate(clean);
    }
    setConfirmMainVisible(false);
    setPendingMainUrl(null);
  };

  // ← حذف عکس با مودال تأیید
  const handleDeletePress = (img: any) => {
    setPendingDeleteImg(img);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteImg) return;
    setConfirmDeleteVisible(false);
    try {
      await deleteImage.mutateAsync({filename: pendingDeleteImg.filename});
      if (pendingDeleteImg.isMain) {
        setMainImageUrl(null);
        showToast('تصویر اصلی حذف شد', 'info');
      } else {
        showToast('تصویر حذف شد', 'success');
      }
      await refetch();
    } catch {
      showToast('خطا در حذف تصویر', 'error');
    } finally {
      setPendingDeleteImg(null);
    }
  };

  return (
    <MainLayout>
      {/* مودال انتخاب تعداد */}
      <ConfirmModal
        visible={confirmPickVisible}
        title="انتخاب تصویر"
        message={`می‌توانید ${remainingCount} تصویر دیگر انتخاب کنید.`}
        cancelText="انصراف"
        confirmText="متوجه شدم"
        confirmColor="#3b82f6"
        onCancel={() => setConfirmPickVisible(false)}
        onConfirm={launchPicker}
      />

      {/* مودال تأیید عکس اصلی */}
      <ConfirmModal
        visible={confirmMainVisible}
        title="تأیید عکس اصلی"
        message="این عکس به عنوان تصویر اصلی پروفایل انتخاب می‌شود."
        cancelText="انصراف"
        confirmText="تأیید"
        confirmColor="#10b981"
        onCancel={() => {
          setConfirmMainVisible(false);
          setPendingMainUrl(null);
        }}
        onConfirm={confirmSetMainImage}
      />

      {/* ← مودال آپلود بدون عکس اصلی */}
      <ConfirmModal
        visible={confirmUploadVisible}
        title="عکس اصلی انتخاب نشده"
        message="می‌خواهید یکی از عکس‌ها را به عنوان عکس اصلی انتخاب کنید؟"
        cancelText="نه، آپلود کن"
        confirmText="بله، انتخاب می‌کنم"
        confirmColor="#3b82f6"
        onCancel={doUpload} // ← بدون عکس اصلی آپلود کن
        onConfirm={() => setConfirmUploadVisible(false)} // ← برگرد انتخاب کنه
      />

      {/* ← مودال تأیید حذف */}
      <ConfirmModal
        visible={confirmDeleteVisible}
        title="حذف تصویر"
        message="آیا از حذف این تصویر مطمئن هستید؟"
        cancelText="انصراف"
        confirmText="حذف"
        confirmColor="#ef4444"
        onCancel={() => {
          setConfirmDeleteVisible(false);
          setPendingDeleteImg(null);
        }}
        onConfirm={confirmDelete}
      />

      <SectionWithLine text="ویرایش عکس پروفایل" />

      {/* ─── بخش بالا: آواتار + انتخاب + پیش‌نمایش ─────────────────────────── */}
      <View style={styles.topSection}>
        {/* آواتار — fix: object پاس بده */}
        <Avatar
          imageUrl={mainImageUrl} // ← mainImageUrl که string هست
          userGender={user?.gender as any} // ← gender کاربر
        />

        {images.length < 3 && (
          <CustomButton
            gradient
            label="انتخاب تصاویر"
            style={styles.button}
            onPress={handlePickImages}
          />
        )}

        {previewUrls.length > 0 && (
          <>
            <ImagePickerGrid
              previewUrls={previewUrls}
              mainImage={mainImageUrl}
              onRemove={handleRemovePreview}
              onSelect={handleSelectMainImage}
            />
            <CustomButton
              gradient
              label={uploadImage.isPending ? 'در حال آپلود...' : 'آپلود تصاویر'}
              onPress={handleUploadPress} // ← اینجا عوض شد
              loading={uploadImage.isPending}
              disabled={uploadImage.isPending}
              style={styles.button}
            />
          </>
        )}
      </View>

      {/* ─── گالری و verification: فقط اسکرول این بخش ──────────────────────── */}
      <ScrollView
        style={styles.bottomScroll}
        showsVerticalScrollIndicator={false}>
        {fullImages.length > 0 && (
          <View>
            <SectionWithLine text="گالری تصاویر" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 12, marginBottom: 8}}>
              {fullImages.map((img, index) => (
                <View key={img.id} style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveImageIndex(index);
                      setIsSliderOpen(true);
                    }}>
                    <Image
                      source={{uri: img.url}}
                      style={[
                        styles.galleryImage,
                        img.isMain && styles.galleryImageMain,
                      ]}
                    />
                    {img.isMain && (
                      <View style={styles.mainLabelWrapper}>
                        <GlobalText style={styles.mainLabel}>
                          ⭐ اصلی
                        </GlobalText>
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={styles.imageActions}>
                    {!img.isMain && (
                      <TouchableOpacity
                        onPress={() => handleSelectMainImage(img.url)}
                        style={styles.actionButton}>
                        <GlobalText style={styles.actionText}>اصلی</GlobalText>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleDeletePress(img)} // ← مودال
                      style={styles.actionButtonDelete}>
                      <GlobalText style={styles.actionText}>حذف</GlobalText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* verification card */}
        <View style={styles.verificationCard}>
          {isVerified ? (
            <View style={styles.verifiedContainer}>
              <GlobalText style={styles.verifiedIcon}>✅</GlobalText>
              <GlobalText style={styles.verifiedText}>
                حساب شما تأیید شده است
              </GlobalText>
            </View>
          ) : (
            <View style={styles.unverifiedContainer}>
              <GlobalText style={styles.verifyTitle}>📸 تأیید هویت</GlobalText>
              <GlobalText style={styles.verifyDesc}>
                با تأیید هویت، اعتماد سایر کاربران جلب می‌شود و شانس مچ شدن شما
                تا ۳ برابر افزایش می‌یابد!
              </GlobalText>
              <View style={styles.verifyButtons}>
                <CustomButton
                  label="شروع تأیید هویت"
                  onPress={() =>
                    navigation.navigate('FaceVerification' as never)
                  }
                  gradient
                  style={{flex: 1}}
                />
                <CustomButton
                  label="انصراف"
                  onPress={() => navigation.goBack()}
                  style={{flex: 1, marginRight: 8}}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <ImageSlider
        visible={isSliderOpen}
        images={fullImages}
        initialIndex={activeImageIndex}
        onClose={() => setIsSliderOpen(false)}
      />
    </MainLayout>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    // ← بخش بالا ثابت، بخش پایین اسکرول
    topSection: {
      padding: 16,
      gap: 12,
      alignItems: 'center',
    },
    bottomScroll: {
      flex: 1, // ← فضای باقیمانده رو می‌گیره
    },
    button: {width: '100%'},
    verificationCard: {
      backgroundColor: theme.colors.card + 'CC',
      borderRadius: 16,
      padding: 20,
      marginVertical: 16,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 3,
    },
    verifiedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
    verifiedIcon: {fontSize: 28},
    verifiedText: {fontSize: 18, fontWeight: 'bold', color: '#10b981'},
    unverifiedContainer: {alignItems: 'flex-end'},
    verifyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'right',
    },
    verifyDesc: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'right',
      lineHeight: 22,
      marginBottom: 16,
    },
    verifyButtons: {flexDirection: 'row-reverse', gap: 8, width: '100%'},
    imageContainer: {marginHorizontal: 8, alignItems: 'center'},
    galleryImage: {
      width: 110,
      height: 110,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    galleryImageMain: {
      borderColor: '#10b981',
      borderWidth: 3,
    },
    mainLabelWrapper: {
      position: 'absolute',
      bottom: 4,
      alignSelf: 'center',
      backgroundColor: 'rgba(16,185,129,0.85)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    mainLabel: {color: '#fff', fontSize: 11, fontWeight: 'bold'},
    imageActions: {flexDirection: 'row', marginTop: 6, gap: 6},
    actionButton: {
      backgroundColor: '#3b82f6',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 6,
    },
    actionButtonDelete: {
      backgroundColor: '#ef4444',
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 6,
    },
    actionText: {color: '#fff', fontSize: 12},
  });

export default EditImg;

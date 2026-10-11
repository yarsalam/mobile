import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import {useTheme} from '../context/MainContext';
import GlobalText from '../components/GlobalText';
const RulesScreen = () => {
  const {theme} = useTheme();
  const styles = getStyles(theme);

  return (
    <MainLayout>
      <SectionWithLine text="قوانین و شرایط استفاده" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section title="درباره یارسلام">
          <Bullet>
            یارسلام یک شبکه اجتماعی مجازی در زمینه همسریابی و ازدواج است که طبق
            قوانین کشورمان ایران و با توجه به فرهنگ اسلامی ایرانی ازدواج، طراحی
            و پیاده‌سازی شده است.
          </Bullet>
          <Bullet>
            سایت همسریابی یارسلام به افراد مجرد کمک می‌کند تا چنانچه به دنبال
            ازدواج و تشکیل خانواده هستند، با ثبت‌نام و تشکیل پروفایل در سایت، با
            فردی که مطابق معیارهایشان است آشنا شوند.
          </Bullet>
          <Bullet>
            سایت یارسلام وابسته به هیچ نهاد و یا موسسه خاصی نبوده و به صورت
            کاملاً مستقل توسط گروه کاملاً مجرب اداره می‌شود.
          </Bullet>
        </Section>

        {/* پذیرش قوانین یارسلام */}
        <Section title="پذیرش قوانین یارسلام">
          <Bullet>
            ثبت‌نام و استفاده از هر یک از بخش‌های یارسلام به منزله مطالعه دقیق و
            پذیرش بی‌چون و چرای تمام قوانین یارسلام می‌باشد. چنانچه شما موافق
            قوانین و مقررات سایت نمی‌باشید به هیچ وجه در سایت ثبت‌نام ننمایید.
          </Bullet>
          <Bullet>
            چنانچه شما دارای سن کمتر از ۱۸ سال می‌باشید نباید در سایت ثبت‌نام
            نمایید. در صورت ثبت‌نام مسدود خواهید شد.
          </Bullet>
          <Bullet>
            آقایان متأهل تنها با ارائه مدرک مبنی بر رضایتمندی همسر خود قادر به
            ثبت‌نام در سایت خواهند بود در غیر این صورت مسدود خواهند شد.
          </Bullet>
        </Section>

        {/* استفاده از خدمات سایت یارسلام */}
        <Section title="استفاده از خدمات سایت یارسلام">
          <Bullet>
            هر بخشی که توسط کاربران نوشته شده است از قبیل "نام" و "توضیحاتی در
            مورد خود، همسر آینده و ..." همچنین تصویر کاربران پس از بررسی و تأیید
            توسط یارسلام، برای سایر کاربران قابل مشاهده خواهد بود و درج هرگونه
            اطلاعات تماس (شماره موبایل، آیدی تلگرام و سایر شبکه‌های اجتماعی) در
            آن‌ها تخلف محسوب می‌شود.
          </Bullet>
          <Bullet>
            تصویر پروفایل باید مربوط به چهره خود کاربر باشد و استفاده از هر نوع
            تصویر دیگر ممنوع می‌باشد.
          </Bullet>
          <Bullet>
            استفاده از اطلاعات جعلی، شماره موبایل یا اطلاعات سایرین در ثبت‌نام و
            یا ثبت‌نام برای دیگران بدون اطلاع آن‌ها خلاف قوانین سایت می‌باشد و
            منجر به مسدودیت پروفایل خواهد شد.
          </Bullet>
          <Bullet>
            شما پس از تشکیل پروفایل می‌توانید در میان کاربران سایت با توجه به
            جنسیت خود جستجو نمایید.
          </Bullet>
          <Bullet>
            می‌توانید به فرد مناسب خود در سایت پیام علاقه‌مندی ارسال نمایید تا
            ایشان نیز پس از مطالعه پروفایل شما، تمایل یا عدم تمایل خود را اعلام
            نماید.
          </Bullet>
          <Bullet>
            در صورتی که دو نفر مایل به آشنایی بیشتر باشند می‌توانند اقدام به
            ارسال پیام بیشتر و درخواست اطلاعات تماس نمایند.
          </Bullet>
          <Bullet>
            ارسال پیام بیشتر از امکانات اعضای ویژه است. در صورتی که شما عضو ویژه
            باشید، گیرنده پیام هم می‌تواند به پیام شما به صورت بیشتر، پاسخ دهد.
          </Bullet>
          <Bullet>
            در صورتی که شما سرویسی را خریداری نمایید، پس از فعال شدن سرویس به
            هیچ عنوان امکان استرداد وجه وجود ندارد.
          </Bullet>
        </Section>

        {/* تخلفات کاربر */}
        <Section title="تخلفات کاربر">
          <Bullet>
            موارد زیر تخلف محسوب شده و منجر به اخطار و یا انسداد پروفایل
            می‌گردد:
          </Bullet>
          <Bullet>داشتن اهدافی غیر از انتخاب همسر</Bullet>
          <Bullet>
            هر گونه پیامی که محتوای آن مخالف قوانین جمهوری اسلامی ایران باشد
            ممنوع است.
          </Bullet>
          <Bullet>ارسال پیام‌های تبلیغاتی و سیاسی در یارسلام</Bullet>
          <Bullet>هر گونه توهین و تحقیر اعضای سایت و یا قومیت‌ها</Bullet>
          <Bullet>ثبت اطلاعات نادرست اعم از نوشتاری و تصویری</Bullet>
          <Bullet>ارسال اسپم (هرزنامه)</Bullet>
          <Bullet>درخواست هر گونه شارژ یا وجه یا کمک و ....</Bullet>
          <Bullet>
            با توجه به فضای مجازی اینترنت، اثبات برخی موارد تخلف بعضاً دشوار
            می‌باشد، با این حال مسئولین سایت چنانچه ظنی به تخلف شما پیدا کنند
            مختارند تا از ادامه فعالیت شما جلوگیری به عمل آورند.
          </Bullet>
          <Bullet>
            چنانچه پروفایل شما در گذشته مسدود شده باشد، حق استفاده مجدد از سایت
            را نخواهید داشت و در صورت مشاهده، توسط مسئولین سایت، بدون تذکر قبلی
            پروفایل جدید شما بسته خواهد شد و تمام سرویس‌های شما قطع و چنانچه
            بابت آن‌ها پرداختی انجام داده‌اید، قابل استرداد نمی‌باشد.
          </Bullet>
        </Section>

        {/* سلب مسئولیت */}
        <Section title="سلب مسئولیت">
          <Bullet>
            ما تمام تلاش خود را می‌کنیم تا محیط امنی را برای شما فراهم کنیم، اما
            تحقیق و بررسی اصلی در مورد صحت و سقم اطلاعات کاربران بر عهده خود
            شماست.
          </Bullet>
          <Bullet>
            ما هیچ‌گونه مسئولیتی را در مقابل اطلاعات غلط، سوء استفاده و یا فریب
            احتمالی را نمی‌پذیریم.
          </Bullet>
          <Bullet>
            سایت همسریابی یارسلام هیچ اپلیکیشنی ندارد و فعلاً تنها به صورت سایت
            فعالیت دارد. لذا بدین وسیله اعلام می‌گردد، هرگونه فعالیت
            اپلیکیشن‌های دیگر به این سایت مرتبط نمی‌باشد و همسریابی یارسلام هیچ
            مسئولیتی در مورد آن بر عهده ندارد.
          </Bullet>
          <Bullet>
            هر نوع پرداخت وجه و اعتبار (اعم از پرداخت اینترنتی، وجه نقد، کارت
            اعتباری، کارت شارژ و ... قبل از رسمی شدن ارتباطات (ثبت ازدواج) به
            سایر کاربران و یا به توصیه آن‌ها اکیداً ممنوع است و سایت یارسلام هیچ
            مسئولیتی در این مورد بر عهده ندارد.
          </Bullet>
        </Section>

        {/* حریم خصوصی */}
        <Section title="حریم خصوصی">
          <Bullet>
            ما اطلاعات شخصی شما مانند ایمیل و شماره تماس را به هیچ وجه در اختیار
            دیگران قرار نمی‌دهیم.
          </Bullet>
          <Bullet>
            اطلاعات شخصی و اطلاعات تماس شما به صورت پیش‌فرض به کاربران سایت
            نمایش داده نمی‌شود.
          </Bullet>
          <Bullet>
            از کاربران محترم تقاضا می‌شود در صورت مشاهده نقض قوانین، مورد را از
            طریق تماس با ما با پلیس سایت در میان بگذارند.
          </Bullet>
          <Bullet>
            شبکه همسرگزینی یارسلام همه امکانات خود را برای ایجاد فضایی سالم و
            امن برای کاربران قانون‌مدار و اخلاق‌مدار بکار می‌گیرد و بی‌شک در این
            راستا با معدود افراد خاطی برخورد جدی خواهد کرد. در صورت درخواست
            مقامات قضایی، ما تمام اطلاعات لازم را در اختیار ایشان قرار خواهیم
            داد.
          </Bullet>
        </Section>

        {/* تغییر قوانین */}
        <Section title="تغییر قوانین">
          <Bullet>
            قوانین سایت ممکن است به مرور زمان دستخوش تغییراتی شود، لذا شما
            موظفید تا به این صفحه مراجعه و آخرین تغییرات را مطالعه نمایید.
          </Bullet>
          <Bullet>
            در صورت تغییر قوانین در یارسلام اطلاع‌رسانی صورت خواهد گرفت.
          </Bullet>
          <Bullet>
            و اما آرزوی یارسلام این است که بتواند فضایی ایمن و پاک و کاربردی
            برای عزیزان خواهان ازدواج فراهم کند و این آرزو با همکاری فعال و
            هوشمندانه شما کاربران عزیز قطعاً دست‌یافتنی است.
          </Bullet>
        </Section>
        <View style={{height: 40}} />
      </ScrollView>
    </MainLayout>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const {theme} = useTheme();
  return (
    <View style={sectionStyles(theme).section}>
      <GlobalText style={sectionStyles(theme).sectionTitle}>{title}</GlobalText>
      <View style={sectionStyles(theme).bulletList}>{children}</View>
    </View>
  );
};

const Bullet = ({children}: {children: React.ReactNode}) => {
  const {theme} = useTheme();
  return (
    <View style={bulletStyles(theme).bulletItem}>
      <GlobalText style={bulletStyles(theme).bullet}>•</GlobalText>
      <GlobalText style={bulletStyles(theme).bulletText}>{children}</GlobalText>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 0.6,
      borderColor: theme.colors.border,
      borderRadius: 5,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'right',
    },
  });

const bulletStyles = (theme: any) =>
  StyleSheet.create({
    bulletList: {
      gap: 10,
    },
    bulletItem: {
      flexDirection: 'row-reverse',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    bullet: {
      fontSize: 18,
      lineHeight: 24,
      color: '#555',
      marginLeft: 8,
    },
    bulletText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
      textAlign: 'right',
    },
  });

const sectionStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'right',
    },
    bulletList: {
      gap: 10,
    },
  });
export default RulesScreen;

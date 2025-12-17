import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from '../Reducer/AuthSlice';
import ProductSlice from '../Reducer/ProductSlice';
import PricingSlice from '../Reducer/PricingSlice';
import CouponSlice from '../Reducer/CouponSlice';
import UpSellSlice from '../Reducer/UpSellSlice';
import DownSellSlice from '../Reducer/DownSellSlice';
import EditorSlice from '../Reducer/EditorSlice';
import BumpProductSlice from '../Reducer/BumpProductSlice';
import AffiliateSlice from '../Reducer/AffiliateSlice';
import PaymentProcessorSlice from '../Reducer/PaymentProcessorSlice';
import FunnelSlice from '../Reducer/FunnelSlice';
import OrderSlice from '../Reducer/OrderSlice';
import PaymentSetupSlice from '../Reducer/PaymentSetupSlice';
import ProductTemplateSlice from '../Reducer/ProductTemplateSlice';
import RevenueSlice from '../Reducer/RevenueSlice';
import UserEditorSlice from '../Reducer/UserEditorSlice';
import PaymentSlice from '../Reducer/PaymentSlice';
import ProfileSlice from '../Reducer/ProfileSlice'
import InvoiceSlice from '../Reducer/InvoiceSlice'
import DashBoardSlice from '../Reducer/DashBoardSlice'
import TransactionSlice from '../Reducer/TransactionSlice';
import PlanSlice from '../Reducer/PlanSlice';
import WalletSlice from '../Reducer/WalletSlice';
import ZoneSlice from '../Reducer/ZoneSlice'
import MoodMeterSlice from '../Reducer/MoodMeterSlice';
import TopicSlice from '../Reducer/TopicSlice';
import ModuleSlice from '../Reducer/ModuleSlice';
import PlanKeySlice from '../Reducer/PlanKeySlice';
import PaymentMethodSlice from '../Reducer/PaymentMethodSlice';
import CourseSlice from '../Reducer/CourseSlice';
import CategorySlice from '../Reducer/CategorySlice'
import RoleSlice from '../Reducer/RoleSlice';
import UserSlice from '../Reducer/UserSlice'
import MoodMasterSlice from '../Reducer/MoodMasterSlice'
import QuestionSlice from '../Reducer/QuestionSlice'
import AnswerSlice from '../Reducer/AnswerSlice'
import BlogSlice from '../Reducer/BlogSlice'
import EquilizerSlice from '../Reducer/EquilizerSlice'
import SidebarSlice from '../Reducer/SidebarSlice'
import AddSlice from '../Reducer/AddSlice'
import TaskSlice from '../Reducer/TaskSlice'
import EcommerceSlice from '../Reducer/EcommerceSlice'
import EcommerceNewSlice from '../Reducer/EcommerceNewSlice'
import ManagePriceTireNewSlice from '../Reducer/ManagePriceTireNewSlice'
<<<<<<< HEAD
import ManageWareHouseNewSlice from '../Reducer/ManageWareHouseNewSlice'
=======
import AddInvetoryNewSlice from '../Reducer/AddInvetoryNewSlice'
>>>>>>> f68d7e590b6605241507ab4363498f0c2ecfac0c
const store = configureStore({
  reducer: {
    auth: AuthSlice,
    transaction: TransactionSlice,
    plan: PlanSlice,
    product: ProductSlice,
    pricing: PricingSlice,
    coupon: CouponSlice,
    upSellProduct: UpSellSlice,
    downSellProduct: DownSellSlice,
    editor: EditorSlice,
    bump: BumpProductSlice,
    affil: AffiliateSlice,
    paymentPro: PaymentProcessorSlice,
    funnels: FunnelSlice,
    order: OrderSlice,
    paykey: PaymentSetupSlice,
    tempPlate: ProductTemplateSlice,
    rev: RevenueSlice,
    usereditors: UserEditorSlice,
    paymentKey: PaymentSlice,
    profile: ProfileSlice,
    invoice: InvoiceSlice,
    dash: DashBoardSlice,
    transactions: WalletSlice,
    zone: ZoneSlice,
    moodData: MoodMeterSlice,
    moodMastersData: MoodMasterSlice,
    topicsData: TopicSlice,
    modulesData: ModuleSlice,
    plankey: PlanKeySlice,
    paymentMethod: PaymentMethodSlice,
    courses: CourseSlice,
    cate: CategorySlice,
    role: RoleSlice,
    user: UserSlice,
    questions: QuestionSlice,
    answers: AnswerSlice,
    blog:BlogSlice,
    equilize:EquilizerSlice,
    sidebar: SidebarSlice,
    add: AddSlice,
    tasks:TaskSlice,
    ecom:EcommerceSlice,
    newecom:EcommerceNewSlice,
    decoration:ManagePriceTireNewSlice,
<<<<<<< HEAD
    warehouse:ManageWareHouseNewSlice
=======
    invent:AddInvetoryNewSlice
>>>>>>> f68d7e590b6605241507ab4363498f0c2ecfac0c
  },
  devTools: import.meta.env.DEV,
});

export default store;

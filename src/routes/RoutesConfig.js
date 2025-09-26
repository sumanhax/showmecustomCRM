import React from 'react';
const Login = React.lazy(() => import('../pages/Auth/Login/Login'));
import InsideLayout from '../ui/layout/InsideLayout';
import OutsideLayout from '../ui/layout/OutsideLayout';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword.jsx';

import Register from '../pages/Auth/Register/Register.jsx';

import ResetPassword from '../pages/Auth/ForgotPassword/ResetPassword.jsx';
import Transaction from '../pages/Transaction/Transaction.jsx';
import Plans from '../pages/Plans/Plans.jsx';
import EditPlanDetails from '../pages/EditPlanDetails/EditPlanDetails.jsx';
import UserRedirectPage from '../pages/Transaction/UserRedirectPage.jsx';
import CreatePlan from '../pages/Plans/CreatePlan.jsx';
import Wallet from '../pages/Wallet/Wallet.jsx';
import VideoAudioPage from '../pages/VideoAudioPage/VideoAudioPage.jsx';
import TransactionList from '../pages/TransactionList/TransactionList.jsx';


import ManageParents from '../pages/ManageParents/ManageParents.jsx';
import ManageRoles from '../pages/ManageRoles/ManageRoles.jsx';
import TopicList from '../pages/ManageTopic/TopicList.jsx';
import ModuleList from '../pages/ManageModule/ModuleList.jsx';
import PaymentMethodList from '../pages/PaymentMethod/PaymentMethodList.jsx';

import ManageZones from '../pages/ManageZones/ManageZones.jsx';
import ManageCategory from '../pages/ManageCategory/ManageCategory.jsx';
import ManageCateDes from '../pages/ManageCategoryDes/ManageCateDes.jsx';

import ManageMoodMeter from '../pages/MoodMeter/ManageMoodMeter.jsx';
import ManageMoodMaster from '../pages/ManageMoodMaster/ManageMoodMaster.jsx';
import ManageQuestion from '../pages/ManageQuestion/ManageQuestion.jsx';
import AnswerManagement from '../pages/AnswerManagement/AnswerManagement.jsx';
import ManageEquilizer from '../pages/Equilizer/ManageEquilizer.jsx';
import ManageKanban from '../pages/Kanban/ManageKanban.jsx';
import ManageLeads from '../pages/ManageLeads/ManageLeads.jsx';
import ManageReps from '../pages/ManageReps/ManageReps.jsx';
import CRMdashboard from '../pages/CRMdashboard/CRMdashboard.jsx';
import TaskManager from '../pages/TaskManager/TaskManager.jsx';
import RepDashboard from '../pages/RepDashboard/RepDashboard.jsx';
import ManageRepEmailBox from '../pages/ManageRepEmailBox/ManageRepEmailBox.jsx';


const allRoutes = [
  {
    path: '/',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/forgot-password',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <ForgotPassword /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/reset-password/:token',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <ResetPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },
  {
    path: '/register',
    element: <OutsideLayout />,
    children: [
      { index: true, element: <Register /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/dashboard',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/transaction',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Transaction />,
      },
    ],
  },
  {
    path: '/create-plan',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <CreatePlan />,
      },
    ],
  },
  {
    path: '/middlePage',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <UserRedirectPage />,
      },
    ],
  },
  {
    path: '/manage-plans',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Plans />,
      },
    ],
  },

  {
    path: '/manage-mood-meter',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageMoodMeter />,
      },
    ],
  },

  {
    path: '/manage-mood-masters',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageMoodMaster />,
      },
    ],
  },
 
  {
    path: '/manage-question',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageQuestion />,
      },
    ],
  },

  {
    path: '/manage-answer',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <AnswerManagement />,
      },
    ],
  },

    {
    path: '/manage-mood-equilizer',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageEquilizer />,
      },
    ],
  },


  {
    path: '/edit-plan-details/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <EditPlanDetails />,
      },
    ],
  },
  {
    path: '/user-wallet/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <Wallet />,
      },
    ],
  },
  {
    path: '/user-video/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <VideoAudioPage />,
      },
    ],
  },
  {
    path: '/user-transaction/:id',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <TransactionList />,
      },
    ],
  },

  {
    path: '/manage-category',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageCategory />,
      },
    ],
  },



  {
    path: '/manage-category-des',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageCateDes />,
      },
    ],
  },

  {
    path: '/manage-zone',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageZones />,
      },
    ],
  },
  {
    path: '/manage-parents',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageParents />,
      },
    ],
  },
  {
    path: '/manage-roles',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageRoles />,
      },
    ],
  },

    {
    path: '/task-manager',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <TaskManager />,
      },
    ],
  },
    {
    path: '/rep-dashboard',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <RepDashboard />,
      },
    ],
  },
    {
    path: '/rep-mailbox',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageRepEmailBox />,
      },
    ],
  },




  {
    path: '/manage-topic',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <TopicList />,
      },
    ],
  },

  {
    path: '/manage-module',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ModuleList />,
      },
    ],
  },

  {
    path: '/payment-method',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <PaymentMethodList />,
      },
    ],
  },
  {
    path: '/kanban',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageKanban />,
      },
    ],  
  },
  {
    path: '/leads',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageLeads />,
      },
    ],  
  },
  {
    path: '/reps',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <ManageReps />,
      },
    ],  
  },
  {
    path: '/crm-dashboard',
    element: <InsideLayout />,
    children: [
      {
        index: true,
        element: <CRMdashboard />,
      },
    ],  
  },


  {
    path: '*',
    element: 'Outside page not found',
  },
];
export default allRoutes;

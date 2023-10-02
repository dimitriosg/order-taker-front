// roleSwitchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  originalRole: null,
  //selectedRole: null,
  hasSwitchedRole: false,
};

// Define the async thunk
export const switchRoleAndNavigate = createAsyncThunk(
  'roleSwitch/switchRoleAndNavigate',
  async ({ newRole, navigate }, { dispatch, getState }) => {
    //const originalRole = localStorage.getItem('role');
    const originalRole = (state) => state.roleSwitch.originalRole;
    const selectedRole = newRole;

    // Prevent other users to switch roles
    if (originalRole !== 'admin' && originalRole !== 'developer') {
      console.error('Permission denied: cannot change roles.');
      return { success: false, message: 'Permission denied: cannot change roles.' };
    }

    // Prevent Admin from switching to Developer
    if (originalRole === 'admin' && newRole === 'developer') {
      console.error('Permission denied: Admins cannot switch to Developer role.');
      return { success: false, message: 'Permission denied: Admins cannot switch to Developer' };
    }

    try {
      // Navigate based on the new role
      switch (selectedRole) {
        case 'admin':
          navigate('/dashboard/AdminDashboard');
          break;
        case 'developer':
          navigate('/dashboard/DeveloperDashboard');
          break;
        case 'accountant':
          navigate('/dashboard/AccountantDashboard');
          break;
        case 'cashier':
          navigate('/dashboard/CashierDashboard');
          break;
        case 'waiter':
          navigate('/dashboard/WaiterDashboard');
          break;
        default:
          navigate('/');
      }

      // Dispatch a success action
      return { success: true };  // Assume success is true if we reach this point
    } catch (error) {
      console.error('Error switching roles:', error);
      // Optionally dispatch a failure action or return an error
      throw error;
    }
  },
  {
    extra: {
      navigate: null,  // This will be set when dispatching the action
    },
  }
);


// Define the slice
export const roleSwitchSlice = createSlice({
  name: 'roleSwitch',
  initialState,
  reducers: {
      setOriginalRole: (state, action) => {
          state.originalRole = action.payload;
      },
      setHasSwitchedRole: (state, action) => {
          state.hasSwitchedRole = action.payload;
      },
  },
  extraReducers: (builder) => {
      builder.addCase(switchRoleAndNavigate.fulfilled, (state, action) => {
          state.hasSwitchedRole = action.payload.success;  // Update hasSwitchedRole based on success status
      });
  }
});

export const { setOriginalRole, setHasSwitchedRole } = roleSwitchSlice.actions;

// Export the selector
export const selectOriginalRole = (state) => state.roleSwitch.originalRole;
export const selectHasSwitchedRole = (state) => state.roleSwitch.hasSwitchedRole;

// Export the reducer
export default roleSwitchSlice.reducer;


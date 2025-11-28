import { Building, Classroom, Booking, User, AvailabilityResponse } from './types';

// Get the API URL from environment or use the default
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Utility functions
const getToken = () => localStorage.getItem('token');

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'An error occurred');
  }
  return response.json();
};

// API endpoints
const api = {
  auth: {
    login: async (email: string, password: string) => {
      if (USE_MOCK_DATA) {
        // Use mock implementation from useAuth
        console.log('Using mock login');
        return null;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      return handleResponse(response);
    },

    register: async (name: string, email: string, password: string, role: string = "teacher") => {
      if (USE_MOCK_DATA) {
        // Use mock implementation from useAuth
        console.log('Using mock register');
        return null;
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      return handleResponse(response);
    },

    getCurrentUser: async () => {
      if (USE_MOCK_DATA) {
        // Use mock implementation from useAuth
        console.log('Using mock getCurrentUser');
        return null;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },
  },

  buildings: {
    getAll: async (): Promise<Building[]> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock getBuildings');
        return [] as Building[];
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/buildings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    create: async (buildingData: Partial<Building>): Promise<Building> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock createBuilding');
        return {} as Building;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/buildings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildingData),
      });

      return handleResponse(response);
    },

    update: async (id: string, buildingData: Partial<Building>): Promise<Building> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock updateBuilding');
        return {} as Building;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/buildings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildingData),
      });

      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock deleteBuilding');
        return;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/buildings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },
  },

  classrooms: {
    getAll: async (buildingId?: string): Promise<Classroom[]> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock getClassrooms');
        return [] as Classroom[];
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const url = buildingId ? 
        `${API_URL}/classrooms?buildingId=${buildingId}` : 
        `${API_URL}/classrooms`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    create: async (classroomData: Partial<Classroom>): Promise<Classroom> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock createClassroom');
        return {} as Classroom;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/classrooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classroomData),
      });

      return handleResponse(response);
    },

    update: async (id: string, classroomData: Partial<Classroom>): Promise<Classroom> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock updateClassroom');
        return {} as Classroom;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/classrooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(classroomData),
      });

      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock deleteClassroom');
        return;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/classrooms/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },
  },

  bookings: {
    getAll: async (userId?: string): Promise<Booking[]> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock getBookings');
        return [] as Booking[];
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const url = userId ? 
        `${API_URL}/bookings?userId=${userId}` : 
        `${API_URL}/bookings`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    create: async (bookingData: Partial<Booking>): Promise<Booking> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock createBooking');
        return {} as Booking;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      return handleResponse(response);
    },

    update: async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock updateBooking');
        return {} as Booking;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock deleteBooking');
        return;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    checkAvailability: async (classroomId: string, date: string): Promise<AvailabilityResponse> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock checkAvailability');
        return {} as AvailabilityResponse;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/availability/${classroomId}?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },
  },
  
  users: {
    getAll: async (): Promise<User[]> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock getUsers');
        return [] as User[];
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    },

    create: async (userData: Partial<User>): Promise<User> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock createUser');
        return {} as User;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      return handleResponse(response);
    },

    update: async (id: string, userData: Partial<User>): Promise<User> => {
      if (USE_MOCK_DATA) {
        // Use mock implementation
        console.log('Using mock updateUser');
        return {} as User;
      }

      const token = getToken();
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      return handleResponse(response);
    },
  },
};

export default api;

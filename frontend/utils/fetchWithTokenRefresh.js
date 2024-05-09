async function fetchWithTokenRefresh(url, options) {
    const response = await fetch(url, options);
  
    if (response.status === 401) {
      // The access token has expired, get a new one
      const refreshResponse = await fetch('http://localhost:8081/users/refresh', {
        method: 'POST',      
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: localStorage.getItem("refreshToken") })
        });
    
        const refreshData = await refreshResponse.json();
    
        // Save the new access token
        localStorage.setItem("token", refreshData.accessToken);
    
        // Retry the original request with the new access token
        options.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
        return fetch(url, options);
      }
    
      return response;
    }
    
    export default fetchWithTokenRefresh;
    
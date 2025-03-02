// service-worker.js

self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    
    const title = data.title || "New Notification";
    const options = {
      body: data.body || "You have a new notification!",
      icon: data.icon || "/icon.png",  // Default icon
      badge: data.badge || "/icon.png",  // Default badge
    };
  
    // Show notification
    event.waitUntil(self.registration.showNotification(title, options));
  });
  
  // Listen for notification click
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();  // Close the notification
  
    // Handle the click (for example, open the app or a specific URL)
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  });
  
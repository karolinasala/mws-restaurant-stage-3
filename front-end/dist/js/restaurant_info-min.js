let restaurant;var map;function showMap(){const e=document.getElementById("map"),t=document.getElementById("map-button");e.style.display="block",t.style.display="none"}window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fetchReviewFromURL=(e=>{if(self.review)return void e(null,self.reviews);const t=getParameterByName("id");t?DBHelper.fetchReviewById(t,(e,t)=>{self.reviews=t,t?fillReviewsHTML():console.error(e)}):(error="No review id",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e);const n=e.name+" in "+e.neighborhood;t.alt=n,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fetchReviewFromURL()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);const l=document.createElement("td");l.innerHTML=e[n],r.appendChild(l),t.appendChild(r)}}),fillReviewsHTML=((e=self.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const r=document.getElementById("reviews-list");e.forEach(e=>{r.insertBefore(createReviewHTML(e),r.firstChild)}),t.appendChild(r)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);const r=document.createElement("p");r.innerHTML=`Rating: ${e.rating}`,t.appendChild(r);const a=document.createElement("p");return a.innerHTML=e.comments,t.appendChild(a),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li"),r=document.createElement("a");r.innerHTML=e.name,r.setAttribute("aria-current","page"),n.appendChild(r),t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}),sendReview=(()=>{event.preventDefault();const e=getParameterByName("id"),t=document.querySelector("#name").value,n=parseInt(document.querySelector("#rating option:checked").value),r=document.querySelector("#comment").value,a={restaurant_id:parseInt(e),name:t,rating:n,comments:r,createdAt:Date.now(),updatedAt:Date.now()};DBHelper.sendReview(a).then(e=>{let t=document.getElementById("reviews-list");t.insertBefore(createReviewHTML(a),t.firstChild)}).catch(e=>{console.error(e);let t=document.getElementById("reviews-list");t.insertBefore(createReviewHTML(a,!0),t.firstChild),DBHelper.cacheReview(a)}),document.getElementById("review-form").reset()}),document.getElementById("send-review").addEventListener("click",sendReview);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJyZXN0YXVyYW50IiwibWFwIiwic2hvd01hcCIsIm1wIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImJ1dHRvbiIsInN0eWxlIiwiZGlzcGxheSIsIndpbmRvdyIsImluaXRNYXAiLCJmZXRjaFJlc3RhdXJhbnRGcm9tVVJMIiwiZXJyb3IiLCJjb25zb2xlIiwic2VsZiIsImdvb2dsZSIsIm1hcHMiLCJNYXAiLCJ6b29tIiwiY2VudGVyIiwibGF0bG5nIiwic2Nyb2xsd2hlZWwiLCJmaWxsQnJlYWRjcnVtYiIsIkRCSGVscGVyIiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsImNhbGxiYWNrIiwiaWQiLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwiZmlsbFJlc3RhdXJhbnRIVE1MIiwiZmV0Y2hSZXZpZXdGcm9tVVJMIiwicmV2aWV3IiwicmV2aWV3cyIsImZldGNoUmV2aWV3QnlJZCIsImZpbGxSZXZpZXdzSFRNTCIsImlubmVySFRNTCIsIm5hbWUiLCJhZGRyZXNzIiwiaW1hZ2UiLCJjbGFzc05hbWUiLCJzcmMiLCJpbWFnZVVybEZvclJlc3RhdXJhbnQiLCJhbHROYW1lIiwibmVpZ2hib3Job29kIiwiYWx0IiwiY3Vpc2luZV90eXBlIiwib3BlcmF0aW5nX2hvdXJzIiwiZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwiLCJvcGVyYXRpbmdIb3VycyIsImhvdXJzIiwia2V5Iiwicm93IiwiY3JlYXRlRWxlbWVudCIsImRheSIsImFwcGVuZENoaWxkIiwidGltZSIsImNvbnRhaW5lciIsInRpdGxlIiwibm9SZXZpZXdzIiwidWwiLCJmb3JFYWNoIiwiaW5zZXJ0QmVmb3JlIiwiY3JlYXRlUmV2aWV3SFRNTCIsImZpcnN0Q2hpbGQiLCJsaSIsInJhdGluZyIsImNvbW1lbnRzIiwiYnJlYWRjcnVtYiIsImEiLCJzZXRBdHRyaWJ1dGUiLCJ1cmwiLCJsb2NhdGlvbiIsImhyZWYiLCJyZXBsYWNlIiwicmVzdWx0cyIsIlJlZ0V4cCIsImV4ZWMiLCJkZWNvZGVVUklDb21wb25lbnQiLCJzZW5kUmV2aWV3IiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInJlc3RhdXJhbnRfaWQiLCJxdWVyeVNlbGVjdG9yIiwidmFsdWUiLCJwYXJzZUludCIsImRhdGEiLCJjcmVhdGVkQXQiLCJEYXRlIiwibm93IiwidXBkYXRlZEF0IiwidGhlbiIsInJlc3BvbnNlIiwicmV2aWV3TGlzdCIsImNhdGNoIiwiZXJyIiwiY2FjaGVSZXZpZXciLCJyZXNldCIsImFkZEV2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLFdBQ0osSUFBSUMsSUFpT0osU0FBU0MsVUFDUCxNQUFNQyxFQUFLQyxTQUFTQyxlQUFlLE9BQzdCQyxFQUFTRixTQUFTQyxlQUFlLGNBQ3ZDRixFQUFHSSxNQUFNQyxRQUFVLFFBQ25CRixFQUFPQyxNQUFNQyxRQUFVLE9BaE94QkMsT0FBT0MsUUFBVSxNQUNoQkMsdUJBQXVCLENBQUNDLEVBQU9aLEtBQ3pCWSxFQUNGQyxRQUFRRCxNQUFNQSxJQUVkRSxLQUFLYixJQUFNLElBQUljLE9BQU9DLEtBQUtDLElBQUliLFNBQVNDLGVBQWUsT0FBUSxDQUM3RGEsS0FBTSxHQUNOQyxPQUFRbkIsRUFBV29CLE9BQ25CQyxhQUFhLElBRWZDLGlCQUNBQyxTQUFTQyx1QkFBdUJWLEtBQUtkLFdBQVljLEtBQUtiLFVBUTVEVSx1QkFBeUIsQ0FBQ2MsSUFDeEIsR0FBSVgsS0FBS2QsV0FFUCxZQURBeUIsRUFBUyxLQUFNWCxLQUFLZCxZQUd0QixNQUFNMEIsRUFBS0MsbUJBQW1CLE1BQ3pCRCxFQUlISCxTQUFTSyxvQkFBb0JGLEVBQUksQ0FBQ2QsRUFBT1osS0FDdkNjLEtBQUtkLFdBQWFBLEVBQ2JBLEdBSUw2QixxQkFDQUosRUFBUyxLQUFNekIsSUFKYmEsUUFBUUQsTUFBTUEsTUFObEJBLE1BQVEsMEJBQ1JhLEVBQVNiLE1BQU8sU0FpQnBCa0IsbUJBQXFCLENB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QyxzQkFDZHdDLEtBQUtOLEdBQ3ZCLE9BQUtJLEVBRUFBLEVBQVEsR0FFTkcsbUJBQW1CSCxFQUFRLEdBQUdELFFBQVEsTUFBTyxNQUQzQyxHQUZBLE9BVVhLLFdBQWEsTUFDWkMsTUFBTUMsaUJBQ04sTUFBTUMsRUFBZ0J0RCxtQkFBbUIsTUFDbkNTLEVBQU9oQyxTQUFTOEUsY0FBYyxTQUFTQyxNQUN2Q2xCLEVBQVNtQixTQUFTaEYsU0FBUzhFLGNBQWMsMEJBQTBCQyxPQUNuRWpCLEVBQVc5RCxTQUFTOEUsY0FBYyxZQUFZQyxNQUM5Q0UsRUFBTyxDQUNaSixjQUFlRyxTQUFTSCxHQUN4QjdDLEtBQU1BLEVBQ042QixPQUFRQSxFQUNSQyxTQUFVQSxFQUNSb0IsVUFBV0MsS0FBS0MsTUFDaEJDLFVBQVdGLEtBQUtDLE9BRW5CakUsU0FBU3VELFdBQVdPLEdBQ2xCSyxLQUFLQyxJQUNOLElBQUlDLEVBQWF4RixTQUFTQyxlQUFlLGdCQUN6Q3VGLEVBQVcvQixhQUFhQyxpQkFBaUJ1QixHQUFPTyxFQUFXN0IsY0FDekQ4QixNQUFNQyxJQUNQakYsUUFBUUQsTUFBTWtGLEdBQ2QsSUFBSUYsRUFBYXhGLFNBQVNDLGVBQWUsZ0JBQ3pDdUYsRUFBVy9CLGFBQWFDLGlCQUFpQnVCLEdBQU0sR0FBT08sRUFBVzdCLFlBQ2pFeEMsU0FBU3dFLFlBQVlWLEtBR3RCakYsU0FBU0MsZUFBZSxlQUFlMkYsVUFHekM1RixTQUFTQyxlQUFlLGVBQWU0RixpQkFBaUIsUUFBU25CIiwic291cmNlc0NvbnRlbnQiOlsibGV0IHJlc3RhdXJhbnQ7XG52YXIgbWFwO1xuXG4vKipcbiAqIEluaXRpYWxpemUgbWFwIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICovXG4gd2luZG93LmluaXRNYXAgPSAoKSA9PiB7XG4gIGZldGNoUmVzdGF1cmFudEZyb21VUkwoKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XG4gICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgIHpvb206IDE2LFxuICAgICAgICBjZW50ZXI6IHJlc3RhdXJhbnQubGF0bG5nLFxuICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgZmlsbEJyZWFkY3J1bWIoKTtcbiAgICAgIERCSGVscGVyLm1hcE1hcmtlckZvclJlc3RhdXJhbnQoc2VsZi5yZXN0YXVyYW50LCBzZWxmLm1hcCk7XG4gICAgfVxuICB9KTtcbiB9XG5cbi8qKlxuICogR2V0IGN1cnJlbnQgcmVzdGF1cmFudCBmcm9tIHBhZ2UgVVJMLlxuICovXG5mZXRjaFJlc3RhdXJhbnRGcm9tVVJMID0gKGNhbGxiYWNrKSA9PiB7XG4gIGlmIChzZWxmLnJlc3RhdXJhbnQpIHtcbiAgICBjYWxsYmFjayhudWxsLCBzZWxmLnJlc3RhdXJhbnQpXG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICBpZiAoIWlkKSB7XG4gICAgZXJyb3IgPSAnTm8gcmVzdGF1cmFudCBpZCBpbiBVUkwnO1xuICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICAgIHNlbGYucmVzdGF1cmFudCA9IHJlc3RhdXJhbnQ7XG4gICAgICBpZiAoIXJlc3RhdXJhbnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZpbGxSZXN0YXVyYW50SFRNTCgpO1xuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBGZXRjaCBSZXZpZXcgZnJvbSBVUkxcbiAqL1xuZmV0Y2hSZXZpZXdGcm9tVVJMID0gKGNhbGxiYWNrKSA9PiB7XG4gIGlmIChzZWxmLnJldmlldykge1xuICAgIGNhbGxiYWNrKG51bGwsIHNlbGYucmV2aWV3cyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICBpZiAoIWlkKSB7XG4gICAgZXJyb3IgPSAnTm8gcmV2aWV3IGlkJztcbiAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgREJIZWxwZXIuZmV0Y2hSZXZpZXdCeUlkKGlkLChlcnJvciwgcmV2aWV3cykgPT4ge1xuICAgICAgc2VsZi5yZXZpZXdzID0gcmV2aWV3cztcbiAgICAgIGlmICghcmV2aWV3cykge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZmlsbFJldmlld3NIVE1MKCk7XG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZVxuICovXG5maWxsUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCA9IHNlbGYucmVzdGF1cmFudCkgPT4ge1xuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICBuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcblxuICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtYWRkcmVzcycpO1xuICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcblxuICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWltZycpO1xuICBpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnO1xuICBpbWFnZS5zcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG5cbiAgY29uc3QgYWx0TmFtZSA9IHJlc3RhdXJhbnQubmFtZSArICcgaW4gJyArIHJlc3RhdXJhbnQubmVpZ2hib3Job29kO1xuICBpbWFnZS5hbHQgPSBhbHROYW1lO1xuXG4gIGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1jdWlzaW5lJyk7XG4gIGN1aXNpbmUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5jdWlzaW5lX3R5cGU7XG5cbiAgaWYgKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSB7XG4gICAgZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwoKTtcbiAgfVxuICBmZXRjaFJldmlld0Zyb21VUkwoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBvcGVyYXRpbmcgaG91cnMgSFRNTCB0YWJsZSBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmVzdGF1cmFudEhvdXJzSFRNTCA9IChvcGVyYXRpbmdIb3VycyA9IHNlbGYucmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnMpID0+IHtcbiAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1ob3VycycpO1xuICBmb3IgKGxldCBrZXkgaW4gb3BlcmF0aW5nSG91cnMpIHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXG4gICAgY29uc3QgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBkYXkuaW5uZXJIVE1MID0ga2V5O1xuICAgIHJvdy5hcHBlbmRDaGlsZChkYXkpO1xuXG4gICAgY29uc3QgdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgdGltZS5pbm5lckhUTUwgPSBvcGVyYXRpbmdIb3Vyc1trZXldO1xuICAgIHJvdy5hcHBlbmRDaGlsZCh0aW1lKTtcblxuICAgIGhvdXJzLmFwcGVuZENoaWxkKHJvdyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYWxsIHJldmlld3MgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXZpZXdzSFRNTCA9IChyZXZpZXdzID0gc2VsZi5yZXZpZXdzKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWNvbnRhaW5lcicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gIHRpdGxlLmlubmVySFRNTCA9ICdSZXZpZXdzJztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICBpZiAoIXJldmlld3MpIHtcbiAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbm9SZXZpZXdzLmlubmVySFRNTCA9ICdObyByZXZpZXdzIHlldCEnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub1Jldmlld3MpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWxpc3QnKTtcbiAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgdWwuaW5zZXJ0QmVmb3JlKGNyZWF0ZVJldmlld0hUTUwocmV2aWV3KSwgdWwuZmlyc3RDaGlsZCk7XG4gIH0pO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodWwpO1xufVxuXG4vKipcbiAqIENyZWF0ZSByZXZpZXcgSFRNTCBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5jcmVhdGVSZXZpZXdIVE1MID0gKHJldmlldykgPT4ge1xuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIG5hbWUuaW5uZXJIVE1MID0gcmV2aWV3Lm5hbWU7XG4gIGxpLmFwcGVuZENoaWxkKG5hbWUpO1xuXG4gIGNvbnN0IHJhdGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgcmF0aW5nLmlubmVySFRNTCA9IGBSYXRpbmc6ICR7cmV2aWV3LnJhdGluZ31gO1xuICBsaS5hcHBlbmRDaGlsZChyYXRpbmcpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5pbm5lckhUTUwgPSByZXZpZXcuY29tbWVudHM7XG4gIGxpLmFwcGVuZENoaWxkKGNvbW1lbnRzKTtcblxuICByZXR1cm4gbGk7XG59XG5cbi8qKlxuICogQWRkIHJlc3RhdXJhbnQgbmFtZSB0byB0aGUgYnJlYWRjcnVtYiBuYXZpZ2F0aW9uIG1lbnVcbiAqL1xuZmlsbEJyZWFkY3J1bWIgPSAocmVzdGF1cmFudD1zZWxmLnJlc3RhdXJhbnQpID0+IHtcbiAgY29uc3QgYnJlYWRjcnVtYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmVhZGNydW1iJyk7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICBhLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcbiAgYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWN1cnJlbnRcIiwgXCJwYWdlXCIpO1xuICBsaS5hcHBlbmRDaGlsZChhKTtcbiAgYnJlYWRjcnVtYi5hcHBlbmRDaGlsZChsaSk7XG59XG5cbi8qKlxuICogIEdldCBhIHBhcmFtZXRlciBieSBuYW1lIGZyb20gcGFnZSBVUkwuXG4gKi9cbmdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lLCB1cmwpID0+IHtcbiAgaWYgKCF1cmwpXG4gICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgaWYgKCFyZXN1bHRzKVxuICAgIHJldHVybiBudWxsO1xuICBpZiAoIXJlc3VsdHNbMl0pXG4gICAgcmV0dXJuICcnO1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuXG4vKipcbiAqIFNlbmQgcmV2aWV3LlxuICovXG5cbnNlbmRSZXZpZXcgPSAoKSA9PiB7XG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdGNvbnN0IHJlc3RhdXJhbnRfaWQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoXCJpZFwiKTtcblx0Y29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmFtZVwiKS52YWx1ZTtcblx0Y29uc3QgcmF0aW5nID0gcGFyc2VJbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhdGluZyBvcHRpb246Y2hlY2tlZCcpLnZhbHVlKTtcblx0Y29uc3QgY29tbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbW1lbnRcIikudmFsdWU7XG5cdGNvbnN0IGRhdGEgPSB7XG5cdFx0cmVzdGF1cmFudF9pZDogcGFyc2VJbnQocmVzdGF1cmFudF9pZCksXG5cdFx0bmFtZTogbmFtZSxcblx0XHRyYXRpbmc6IHJhdGluZyxcblx0XHRjb21tZW50czogY29tbWVudHMsXG4gICAgY3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgIHVwZGF0ZWRBdDogRGF0ZS5ub3coKVxuXHR9O1xuXHREQkhlbHBlci5zZW5kUmV2aWV3KGRhdGEpXG4gIC50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRsZXQgcmV2aWV3TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3cy1saXN0XCIpO1xuXHRcdHJldmlld0xpc3QuaW5zZXJ0QmVmb3JlKGNyZWF0ZVJldmlld0hUTUwoZGF0YSksIHJldmlld0xpc3QuZmlyc3RDaGlsZCk7XG5cdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHRsZXQgcmV2aWV3TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3cy1saXN0XCIpO1xuXHRcdFx0cmV2aWV3TGlzdC5pbnNlcnRCZWZvcmUoY3JlYXRlUmV2aWV3SFRNTChkYXRhLCB0cnVlKSwgcmV2aWV3TGlzdC5maXJzdENoaWxkKTtcblx0XHRcdERCSGVscGVyLmNhY2hlUmV2aWV3KGRhdGEpO1xuXHRcdH0pO1xuXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmV2aWV3LWZvcm1cIikucmVzZXQoKTtcbn1cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQtcmV2aWV3JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZW5kUmV2aWV3KTtcblxuXG4vKipcbiAqIFNob3cgbWFwIGFmdGVyIG9uY2xpY2sgZXZlbnRcbiAqL1xuZnVuY3Rpb24gc2hvd01hcCgpIHtcbiAgY29uc3QgbXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKTtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXAtYnV0dG9uXCIpO1xuICBtcC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBidXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuIl0sImZpbGUiOiJyZXN0YXVyYW50X2luZm8tbWluLmpzIn0=

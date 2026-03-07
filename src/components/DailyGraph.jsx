<div className="mt-8">
  <h3 className="text-xl font-bold mb-2">Monthly Goal</h3>
  <p>Goal: {monthlyGoal} miles</p>
  <p>Progress: {totalDistanceThisMonth.toFixed(2)} miles</p>
  <p>Remaining: {(monthlyGoal - totalDistanceThisMonth).toFixed(2)} miles</p>
</div>

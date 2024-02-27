/******************************************************************************

                              Online C++ Compiler.
               Code, Compile, Run and Debug C++ program online.
Write your code in this editor and press "Run" button to compile and execute it.

*******************************************************************************/

#include <iostream>
#include<bits/stdc++.h>
using namespace std;
 
int maximizeBitwiseFun(int N , vector<int> A , int k)
{

    long long ans = INT_MIN ; 

    long long or_val , and_val , sum_val ; 
   long long mod = 1e9 + 7 ; 
    for( int i =  0 ; i < N ; ++i )
    {
        or_val = A[i];
        and_val = A[i];
        sum_val = A[i];

        for( int j = i+1 ; j < N ; ++j )
        {
            or_val = (or_val | A[j] ) % mod ;

            and_val = (and_val & A[j]) % mod;
            sum_val = (sum_val + A[j]) % mod;
            
            cout<<and_val<<" ";
            if (and_val >= k)
            {
                ans = max(ans, (or_val + sum_val) % mod);
                cout << or_val + sum_val << " ";
            }
        }
    }

    return ans%mod ; 
}
int main()
{
       int n = 5 ;
       vector<int> a = {7,10,3,7,5};
       int k = 9;
       cout<<maximizeBitwiseFun(n,a,k);
    // int t ; 
    // cin >> t;
    // while(t--)
    // {

    //     long long n;
    //     cin >> n;
    //     cout << ABPairs(n);

    // }
    // cout<<"INTput \n";

    //  int N , K ; 
    //  cin >> N >> K ; 
    //  vector<int> cost(N) ,sell(N);
    //  for( int i = 0 ; i < N ; ++i )
    //  {
    //      cin >> cost[i];
        
    //  }
    //  for(int i = 0 ; i < N ; ++i )
    //  {
    //      cin >> sell[i];
        
    //  }
     
    //  cout<<solve(N,K,cost,sell);
    // return 0;
    
}

#ifndef ALGS_H
#define ALGS_H

#include <algorithm>
#include <queue>
#include <string>
#include <vector>
using std::swap;



template<typename T>
void heapsort(std::vector<T>& V){
	std::priority_queue<T> pq(V.begin(), V.end());

	for(int i = V.size() - 1; i >= 0; --i){
		V[i] = pq.top();
		pq.pop();
	}
}



bool are_anagrams(std::string a, std::string b){
	if(a.length() != b.length())
		return false;

	int counts[26] = {0};

	for(int i = 0; i < a.length(); ++i){
		counts[a[i] - 'A']++;
		counts[b[i] - 'A']--;
	}

	for(int i = 0; i < 26; ++i){
		if(counts[i] != 0)
			return false;
	}
	
	return true;
}


#endif

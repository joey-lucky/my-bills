package com.joey.bill.repository;

import com.google.gson.Gson;
import com.joey.bill.model.entity.BcUserEntity;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.text.DateFormat;
import java.util.Date;

@RunWith(SpringRunner.class)
@SpringBootTest
class UserRepositoryTests {

	@Resource
    private BcUserRepository userRepository;

	@Test
	public void testSave() {

	}

	@Test
	public void testBaseQuery() {
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG);
		String formattedDate = dateFormat.format(date);
		BcUserEntity name = userRepository.findByName("黄秋裕");
		System.out.println(new Gson().toJson(name));
//		List<BcUserEntity> all = userRepository.findAll();
//		System.out.println(new Gson().toJson(all));

//		BcUserEntity user=new BcUserEntity("ff", "ff123456","ff@126.com", "ff",  formattedDate);
//		userRepository.findById(3L);
//		userRepository.save(user);
//		userRepository.delete(user);
//		userRepository.count();
//		userRepository.existsById(3L);
	}
//
//	@Test
//	public void testCustomSql() {
//		userRepository.modifyById("neo",3L);
//		userRepository.deleteById(3L);
//		userRepository.findByEmail("ff@126.com");
//	}
//
//
//	@Test
//	public void testPageQuery()  {
//		int page=1,size=2;
//		Sort sort = new Sort(Sort.Direction.DESC, "id");
//		Pageable pageable = PageRequest.of(page, size, sort);
//		userRepository.findALL(pageable);
//		userRepository.findByNickName("aa", pageable);
//	}

}